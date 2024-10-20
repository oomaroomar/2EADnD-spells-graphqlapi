"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SpellResolver = void 0;
const Spell_1 = require("../entities/Spell");
const types_1 = require("../types");
const type_graphql_1 = require("type-graphql");
let SpellResolver = class SpellResolver {
    async getSpellByID(id) {
        return Spell_1.Spell.findOneBy({ id });
    }
    async getSpellByName(name) {
        return Spell_1.Spell.findBy({ name });
    }
    async createSpell(spellInfo) {
        console.log(spellInfo);
        return Spell_1.Spell.create(Object.assign({}, spellInfo)).save();
    }
};
__decorate([
    (0, type_graphql_1.Query)(() => Spell_1.Spell),
    __param(0, (0, type_graphql_1.Arg)("id", () => type_graphql_1.Int)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], SpellResolver.prototype, "getSpellByID", null);
__decorate([
    (0, type_graphql_1.Query)(() => [Spell_1.Spell]),
    __param(0, (0, type_graphql_1.Arg)("name", () => String)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SpellResolver.prototype, "getSpellByName", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => Spell_1.Spell),
    __param(0, (0, type_graphql_1.Arg)("spellInfo")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [types_1.SpellInput]),
    __metadata("design:returntype", Promise)
], SpellResolver.prototype, "createSpell", null);
SpellResolver = __decorate([
    (0, type_graphql_1.Resolver)(Spell_1.Spell)
], SpellResolver);
exports.SpellResolver = SpellResolver;
//# sourceMappingURL=spell.js.map