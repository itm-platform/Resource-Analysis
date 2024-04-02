export default [
    {
      type: "Client",
      name: "Client A",
      children: [
        {
          type: "Manager",
          name: "Manager A1",
          children: [
            { type: "Employee", name: "Employee A1" },
            { type: "Employee", name: "Employee A2" }
            
          ] 
        }
      ]
    },
    {
      type: "Client",
      name: "Client B",
      children: [
        {
          type: "Manager",
          name: "Manager B1",
          children: [
            { type: "Employee", name: "Employee B1" },
            { type: "Employee", name: "Employee B2" }
          ]
        },
        {
          type: "Manager",
          name: "Manager B2",
          children: [
            { type: "Employee", name: "Employee B3" },
            { type: "Employee", name: "Employee B4" }
          ]
        }
      ]
    }
    
  ]