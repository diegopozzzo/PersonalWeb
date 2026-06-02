const query = `
  query {
    species(filter: { name: { eq: "pikachu" } }) {
      nodes {
        name
        dex
        forms {
          name
          index
          sprites {
            primary {
              fileName
              cdn
            }
          }
        }
      }
    }
  }
`;

const res = await fetch("https://spriteserver.pmdcollab.org/graphql", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ query }),
});
console.log(await res.text());
