import {
    Resolver,
    Mutation,
    Arg,
    Field,
    Ctx,
    ObjectType,
    Query,
    FieldResolver,
    Root,
    InputType,
  } from "type-graphql";
import { MyContext } from "../types";
import { User } from "../entities/User";
import argon2 from "argon2";
import { COOKIE_NAME, FORGET_PASSWORD_PREFIX } from "../constants";
import { v4 } from "uuid";
import { validateRegister } from "../utils/validateRegister";
import { sendEmail } from "../utils/sendEmail";
  
  @ObjectType()
  class FieldError {
    @Field()
    field: string;
    @Field()
    message: string;
  }
  
  @ObjectType()
  class UserResponse {
    @Field(() => [FieldError], { nullable: true })
    errors?: FieldError[];
  
    @Field(() => User, { nullable: true })
    user?: User;
  }

  @InputType()
  export class UsernamePasswordInput {
    @Field()
    email: string;
    @Field()
    username: string;
    @Field()
    password: string;
  }
  
  @Resolver(User)
  export class UserResolver {
    @FieldResolver(() => String)
    email(@Root() user: User, @Ctx() { req }: MyContext) {
      // this is the current user and its ok to show them their own email
      if (req.session.userId === user.id) {
        return user.email;
      }
      // current user wants to see someone elses email
      return "";
    }
  
    @Mutation(() => UserResponse)
    async changePassword(
      @Arg("token") token: string,
      @Arg("newPassword") newPassword: string,
      @Ctx() { redis, req }: MyContext
    ): Promise<UserResponse> {
      if (newPassword.length <= 2) return { errors: [{ field: "newPassword", message: "length must be greater than 2"}]}
  
      const key = FORGET_PASSWORD_PREFIX + token;
      const userId = await redis.get(key);
      if (!userId) {
        return {
          errors: [
            {
              field: "token",
              message: "token expired",
            },
          ],
        };
      }
  
      const userIdNum = parseInt(userId);
      const user = await User.findOneBy({id: userIdNum});
  
      if (!user) return { errors: [{ field: "token", message: "user no longer exists"}]}
  
      const newHashedPassword = await argon2.hash(newPassword)

      await User.update({ id: userIdNum }, {password: newHashedPassword})
  
      await redis.del(key);
  
      // log in user after change password
      req.session.userId = user.id;
  
      return { user };
    }
  
    @Mutation(() => Boolean)
    async forgotPassword(
      @Arg("email") email: string,
      @Ctx() { redis }: MyContext
    ) {
      const user = await User.findOne({ where: { email } });
      if (!user) {
        // the email is not in the db
        return true;
      }
  
      const token = v4();

      await redis.set(FORGET_PASSWORD_PREFIX + token, user.id, 
        'EX', 1000 * 30) // 30 minutes
  
      await sendEmail(
        email,
        `<a href="http://localhost:3000/change-password/${token}">reset password</a>`
      );
  
      return true;
    }
  
    @Query(() => User, { nullable: true })
    me(@Ctx() { req }: MyContext) {
      // you are not logged in
      if (!req.session.userId) {
        return null;
      }
      return User.findOneBy({ id: req.session.userId })
    }
  
    @Mutation(() => UserResponse)
    async register(
      @Arg("options") options: UsernamePasswordInput,
      @Ctx() { req }: MyContext
    ): Promise<UserResponse> {
      const errors = validateRegister(options);
      if (errors) {
        return { errors };
      }
      // Don't save passwords as plain text :)
      const hashedPassword = await argon2.hash(options.password);
      let user;
      try {
        user = await User.create({username: options.username, password: hashedPassword, email: options.email}).save()
      } catch (err) {
        // duplicate username error
        if (err.code === "23505") return { errors: [{field: "username", message: "username already taken"}]};
      }
      // Sets a cookie on the client. Which is later used for all authentication. Reddis handles encryption.
      req.session.userId = (user as User).id
      return {user}
     }
  
    @Mutation(() => UserResponse)
    async login(
      @Arg("usernameOrEmail") usernameOrEmail: string,
      @Arg("password") password: string,
      @Ctx() { req }: MyContext
    ): Promise<UserResponse> {
      const user = usernameOrEmail.includes('@') 
        ? await User.findOneBy({email: usernameOrEmail}) 
        : await User.findOneBy({username: usernameOrEmail})
      if (!user) {
        return {
          errors: [
            {
              field: "usernameOrEmail",
              message: "that username doesn't exist",
            },
          ],
        };
      }
      const valid = await argon2.verify(user.password, password);
      if (!valid) {
        return {
          errors: [
            {
              field: "password",
              message: "incorrect password",
            },
          ],
        };
      }
  
      req.session.userId = user.id;
  
      return {
        user,
      };
    }
  
    @Mutation(() => Boolean)
    logout(@Ctx() { req, res }: MyContext) {
      return new Promise((resolve) =>
        req.session.destroy((err) => {
          res.clearCookie(COOKIE_NAME);
          if (err) {
            console.log(err);
            resolve(false);
            return;
          }
  
          resolve(true);
        })
      );
    }
  }