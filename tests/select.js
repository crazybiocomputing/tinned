function setflag(mol){
    for (let i = 0; i < mol.pdb.atoms.length; i++){
        mol.flag.push(0);
    }
}

function select_AA(mol,aa){
    for (let i = 0; i < mol.pdb.atoms.length; i++){
        if (mol.pdb.atoms[i].resName === aa){
            mol.flag[i] = 1;
        }
    }
    return mol;
}
