function setflag(mol){
    for (let i = 0; i < mol.pdb.atoms.length; i++){
        mol.flag.push(0);
    }
}

function select(mol,key,value){
    for (let i = 0; i < mol.pdb.atoms.length; i++){
        if (mol.pdb.atoms[i][key] === value){
            mol.flag[i] = 1;
        }
    }
    return mol;
}

function select_and(mol,mol1,mol2){
    for (let i=0; i<mol1.length; i++){
        if (mol1.flag[i] === 1 && mol2.flag === 1){
            mol.flag[i] = 1;
        }
    }
    return mol;
}

function select_or(mol,mol1,mol2){
    for (let i=0; i<mol1.length; i++){
        if (mol1.flag[i] === 1 || mol2.flag === 1){
            mol.flag[i] = 1;
        }
    }
    return mol;
}