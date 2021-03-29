describe("Classification",()=>{
    it("should be a protein type",()=>{
        expect(small_1zni.header.classification).toBe("HORMONE")
    });
});

describe("Selection Atome", function() {
    it("should transform flag to 1", function() {
        select_AA(mol_1zni,"TYR");
        expect(mol_1zni.flag[1]).toBe(1);
        expect(mol_1zni.flag[2]).toBe(1);
    });
});

describe("Selection Element", function(){
    it("should transform flag to 1", function() {
        select_Elem(mol_1zni,"C");
        expect(mol_1zni.flag[1]).toBe(1);
        expect(mol_1zni.flag[2]).toBe(1);
        expect(mol_1zni.flag[3]).toBe(1);
    });
});

