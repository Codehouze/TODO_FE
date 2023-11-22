export interface ICreateTodo {
    title: string;
    // Add other properties as needed
  }

  export interface ICompleteTodoParams {
    id: number;
    completed: boolean;
  }

  export interface ITodo {
    id:number;
    title:string,
    completed:boolean;
    isDeleted:boolean;
  }