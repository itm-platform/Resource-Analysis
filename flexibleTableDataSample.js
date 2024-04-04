export default [
    {
      type: "Program",
      name: "Program A",
      client: "Client A",
      children: [
        {
          type: "Project",
          name: "Project A1",
            client: "Client A",
          children: [
            { type: "Task", name: "Task A1" },
            { type: "Task", name: "Task A2" }
            
          ] 
        }
      ]
    },
    {
      type: "Program",
      name: "Program B",
      children: [
        {
          type: "Project",
          name: "Project B1",
          client: "Client B",         
          children: [
            { type: "Task", name: "Task B1" },
            { type: "Task", name: "Task B2" }
          ]
        },
        {
          type: "Project",
          name: "Project B2",
          children: [
            { type: "Task", name: "Task B3" },
            { type: "Task", name: "Task B4" }
          ]
        }
      ]
    }
    
  ]