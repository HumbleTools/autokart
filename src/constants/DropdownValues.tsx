export const AISLES: LabelWithId[] = [
    { id: '10', label: 'Fruits et légumes' },
    { id: '20', label: 'Frais, viande et poisson' },
    { id: '30', label: 'Épicerie salée' },
    { id: '40', label: 'Épicerie sucrée' },
    { id: '50', label: 'Surgelés' },
    { id: '60', label: 'Boissons' },
    { id: '70', label: 'Maison, entretien' },
    { id: '80', label: 'Autres' }
];

export const UNITS: LabelWithId[] = [
    {id: 'mg', label: 'mg'},
    {id: 'g', label: 'g'},
    {id: 'kg', label: 'kg'},
    {id: 'ml', label: 'ml'},
    {id: 'cl', label: 'cl'},
    {id: 'L', label: 'L'},
    {id: 'number', label: 'nombre'},
    {id: 'cac', label: 'cac'},
    {id: 'cas', label: 'cas'},
];

interface LabelWithId {
    id: string;
    label: string;
}

export const buildOptions: (values: LabelWithId[]) => JSX.Element[] = values => 
values.map(it => <option value={it.id} key={it.id}>{it.label}</option>);

export const getLabelFromId: (values: LabelWithId[], id: string) => string = (values, id) =>{
    const result = values.find(it => it.id===id)?.label;
    return result ? result : 'label_not_found';
};
