describe("Classification",()=>{
    it("should be a protein type",()=>{
        expect(small_1zni.header.classification).toBe("HORMONE")
    });
});

describe("Selection Atome", function() {
    it("should transform flag to 1", function() {
        let res = select(mol_1zni,"resName","TYR");
        expect(res.flag[1]).toBe(1);
        expect(res.flag[2]).toBe(1);
    });
});

describe("Selection Element", function(){
    it("should transform flag to 1", function() {
        let res = select(mol_1zni,"element","C");
        expect(res.flag[1]).toBe(1);
        expect(res.flag[2]).toBe(1);
        expect(res.flag[3]).toBe(1);
    });
});

describe("Selection Numero", function(){
    it("should transform flag to 1", function() {
        let res = select(mol_1zni,"serial",92);
        expect(res.flag[1]).toBe(1);
    });
});

describe("Atome d'azote ou Tyrosine", function(){
    it("should transform flag to 1", function() {
        let res = select_or(mol_1zni,select(mol_1zni,"name","N"),select(mol_1zni,"resName","TYR"))
        expect(res.flag[0]).toBe(1);
        expect(res.flag[1]).toBe(1);
        expect(res.flag[2]).toBe(1);
    });
});

describe("Atome de carbone et Tyrosine", function(){
    it("should transform flag to 1", function() {
        let res = select_and(mol_1zni,select(mol_1zni,"element","C"),select(mol_1zni,"resName","TYR"));
        expect(res.flag[1]).toBe(1);
        expect(res.flag[2]).toBe(1);
    });
});

describe("Atome de carbone, Tyrosine et Carbone Alpha", function(){
    it("should transform flag to 1", function() {
        let res = select_and(mol_1zni,select_and(mol_1zni,select(mol_1zni,"element","C"),
        select(mol_1zni,"name","CA")),select(mol_1zni,"resName","TYR"));
        expect(res.flag[1]).toBe(1);
    });
});

describe("Atome de carbone, Tyrosine ou Carbone Alpha", function(){
    it("should transform flag to 1", function() {
        let res = select_or(mol_1zni,select_or(mol_1zni,select(mol_1zni,"element","C"),
        select(mol_1zni,"name","CA")),select(mol_1zni,"resName","TYR"));
        expect(res.flag[1]).toBe(1);
    });
});