
const persons = [
    {
      name: "Joe",
      animals: [
        {species: "dog", name: "Bolt"},
        {species: "cat", name: "Billy"},
      ]
    },
    {
      name: "Bob",
      animals: [
        {species: "dog", name: "Snoopy"}
      ]
    }
  ];


const result = persons.filter(p => p.animals.some(s => s.species === 'cat'));

console.log(result); 