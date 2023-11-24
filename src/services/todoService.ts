import axios from "axios";
import { ICompleteTodoParams } from "../types/ITodo";

const API_URL = "http://localhost:5000/api/v1/";

export const create = (title: string) => {
  return axios.post(API_URL + "todo", {
    title
  });
};

export const getAllTodo = async () => {
  try {
    const response = await axios
      .get(API_URL + "todo");
    const payload = response.data;
    return payload;
  } catch (error) {
    // Handle the error here
    console.error('Error fetching todos:', error);
    throw error; // Rethrow the error if needed for further handling
  }
};

export const getOneTodo = async (id:number) => {
    const response = await axios
    .get(API_URL + `todo/${id}`, {
      params: {
        id
      }
    });
  const payload = response.data;
  return payload;
  };

  export const updateTodo = async (id:number,title:string) => {
    console.log(id,title)
    const response = await axios
      .patch(API_URL + `todo/${id}`, {
        title
      });
    const payload = response.data;
    console.log("Returned object",payload)
    return payload;
  };


  export const deleteTodo = async (id:number) => {
    const response = await axios
      .delete(API_URL + `todo/${id}`, {
        params: {
          id
        }
      });
    const payload = response.data;
    return payload;
  };
  
export const completeTodo = async ({id,completed}:ICompleteTodoParams) =>{
  const response = await axios.patch(API_URL + `todo/complete/${id}`, {
    completed
  });
  const payload = response.data;
  console.log(payload);
  return payload;
}

