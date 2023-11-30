import { Grid, Paper, Button, Box, TextField, Typography } from '@mui/material';
import { DataGrid, GridCellEditStopParams, GridColDef, GridRowModel, MuiEvent } from '@mui/x-data-grid';
import { ITodo } from "../types/ITodo";
import Switch from '@mui/material/Switch';
import AddCircleRoundedIcon from '@mui/icons-material/AddCircleRounded'
import { useState, useEffect, ChangeEvent, useCallback } from "react";
import { create, getAllTodo, updateTodo, deleteTodo, completeTodo } from "../services/todoService";
import DeleteForeverRoundedIcon from '@mui/icons-material/DeleteForeverRounded';
import Snackbar from '@mui/material/Snackbar';
import Alert, { AlertProps } from '@mui/material/Alert';
import * as yup from 'yup';


const TodoApp = () => {
  const [todo, setTodo] = useState<ITodo[]>([]);
  const [formData, setFormData] = useState({ title: '' });
  const [errors, setErrors] = useState({ title: '' });
  // Update initial state to true
  const [isLoading, setIsLoading] = useState(false); 
  const [selectedTodo, setSelectedTodo] = useState(null)
  const label = { inputProps: { 'aria-label': 'Switch demo' } };
  const [snackbar, setSnackbar] = useState<Pick<
    AlertProps,
    'children' | 'severity'
  > | null>(null);

  const handleCloseSnackbar = () => setSnackbar(null);

  const [completed, setCompleted] = useState(() => {
    // Retrieve the value from localStorage
    const storedValue = localStorage.getItem('completed');

    // Return the parsed value or the default value (false)
    return storedValue ? JSON.parse(storedValue) : false;
  });

  useEffect(() => {
    // Save the current value of `completed` to localStorage whenever it changes
    localStorage.setItem('completed', JSON.stringify(completed));
  }, [completed]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>,id:number) => {
    setTodo((prevTodo) =>
    prevTodo.map((todoItem) =>
      todoItem.id === id ? { ...todoItem, completed: !todoItem.completed } : todoItem
    ))
    // setCompleted(event.target.checked);
  };

  // Fetch all todos when the component mounts
  useEffect(() => {
    fetchAllTodos();
  }, []);

  const fetchAllTodos = () => {
      // Set isLoading to true before making the API call
      setIsLoading(true);
      getAllTodo().then((payload) => {
     
      setTodo(payload.todo);
     
    }).catch((error) => {
      console.error('Error fetching todos:', error);
      // Handle the error, e.g., show a message to the user
    })
    .finally(()=>{
       // Set isLoading to false when data (or error) is loaded
      setIsLoading(false);
    })
  };
    // retrieve data and map through output from get all api call..  
    const todoObjects = (todo?? []).map((todoItem: ITodo) => ({ ...todoItem }));

    // complete todo
 

  const handleCompletedTodo = async (params: ITodo) => {
    try {
      const { id, completed } = params;
      const updatedCompleted = !completed;
  
      // Call the API to update the completion status
      await completeTodo({ id, completed: updatedCompleted });
  
      // Update the local state if needed
      setTodo((prevTodo) =>
        prevTodo.map((todoItem) =>
          todoItem.id === id ? { ...todoItem, completed: updatedCompleted } : todoItem
        )
      );
    } catch (error) {
      // Handle errors if needed
      console.error('Error updating todo:', error);
    }
  };


  const handleUpdateTitleUpdateError = useCallback((error: Error) => {
    console.log(error.message)
    setSnackbar({ children: error.message, severity: 'error' });
  }, []);



  // Make the HTTP request to save in the backend
  const handleUpdateTitle = useCallback(async (newRow: GridRowModel) => {
    const { id, title } = newRow
    console.log(id, title,newRow);
    try{
    const result = await updateTodo(id, title);
 

    const updatedRow = { ...result, }; // Update the existing row with the new id
    const{message,updatedTodo}=updatedRow;
    console.log(message,updatedRow);
    // Update the local state if needed
    setTodo((prevTodo) =>
      prevTodo.map((todoItem) =>
        todoItem.id === updatedTodo.id ? { ...todoItem, title: updatedTodo.title } : todoItem
      )
    );
   
    setSnackbar({ children: message, severity: 'success' });
    return updatedTodo;
    }catch(error) {
    console.error('Error updating title',error);
    }
  }, [updateTodo]);

  const handleDeleteTodo = (selectedTodo: number) => {
    if (selectedTodo !== undefined) {
      deleteTodo(selectedTodo).then(() => {
        fetchAllTodos();
        // selectedTodo(null);
      }).catch((error) => {
        console.error('Error deleting todo:', error);
        // Handle the error, e.g., show a message to the user
      });
    };
  }


  // create new todo
  // Input validation
  const validationSchema = yup.object({
    title: yup.string().required('Task is required'),
  });
  const handleBlur = async (e: { target: { name: any; value: any; }; }) => {
    const { name, value } = e.target;
    try {
      await validationSchema.validateAt(name, { [name]: value });
      setErrors({ ...errors, [name]: '' });
    } catch (error: any) {
      setErrors({ ...errors, [name]: error.message });
    }
  };

  // Handle form input changes
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Handle form submission
  const handleCreateTodo = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    try {
      await validationSchema.validate(formData, { abortEarly: false });
      const data = formData.title
      await create(data).then(() => {
        fetchAllTodos();
        setFormData({ title: "" });
        setCompleted(false);
        setErrors({ title: '' });

      })
    }
    catch (error: any) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        ...error.inner.reduce((errors: { [x: string]: any; }, err: { path: string | number; message: any; }) => {
          errors[err.path] = err.message;
          return errors;
        }, {}),
      }));


    };
  }


  // create a column for the grid ...
  const columns: GridColDef[] = [
    {
      field: 'title',
      headerName: 'Todos',
      width: 500,
      editable: true,
    },
    {
      field: 'completed',
      headerName: 'Status',
      width: 100,
      valueGetter: (params) => {

        const isCompleted = params.value as boolean;

        return isCompleted ? ("Completed") : ('Incomplete');
      },

    },
    {
      field: 'isCompleted',
      headerName: 'Update Status',
      type: 'button',
      width: 120,
      renderCell: (params) => (
        <Button
          color="primary"
          onClick={() => handleCompletedTodo(params.row)}
        >
          <Switch {...label} checked={params.row.completed}
            onChange={(e)=>handleChange(e,params.row.id)} />
        </Button>
      ),

    },
    {
      field: 'delete',
      headerName: 'Delete',
      type: 'button',
      width: 100,
      renderCell: (params) => (
        <Button
          color="secondary"
          onClick={() => handleDeleteTodo(params.row.id)}

        >
          <DeleteForeverRoundedIcon />
        </Button>
      ),

    }
  ];

  return (
      <Grid container justifyContent="center" alignItems="center" sx={{ width: '100%',padding:'16px' }}>
        <Paper elevation={0} sx={{ width: "100%",maxWidth:'950px', padding:"16px" }}>

          <h1>Todo</h1>
          <Grid container>
            <main>
              {/* input to add todo */}
              <form onSubmit={handleCreateTodo}>
                <TextField
                  type="text"
                  name="title"
                  value={formData.title}
                  onBlur={handleBlur}
                  onChange={handleInputChange}
                  placeholder="What needs to be done today?"
                  label="Write a Task here"
                  fullWidth
                  error={Boolean(errors.title)}
                  helperText={errors.title}
                  size="small"
                  sx={{ width: '100%' }}
                  margin="dense"
                />


                <Button
                  // component={ReactLink}
                  // to="/add endpoint"
                  type="submit"
                  color="primary"
                  // variant="contained"
                  sx={{
                    margin: "0px 0px", borderRadius: "50%",
                    padding: "0px"
                  }}
                // onClick={handleCreateTodo}
                >
                  <AddCircleRoundedIcon sx={{ fontSize: '36px' }} />
                </Button>
              </form>


            </main>
            {/* list todo */}
            {!isLoading ? (
              <Box sx={{ height:'auto', width: '120vh', paddingTop: '20px', mx: "auto", alignItems: "center", justifyItems: "center" }}>
                <DataGrid getRowId={(row) => row.id}
                  rows={todoObjects}
                  columns={columns}
                  sx={{ width: '100%', mx: 'auto', justifyContent: 'center', alignContent: 'center' }}
                  initialState={{
                    pagination: {
                      paginationModel: {
                        pageSize: 10,
                      },
                    },
                  }}
                  processRowUpdate={handleUpdateTitle}
                  onProcessRowUpdateError={handleUpdateTitleUpdateError}
                  onCellEditStop={(params: GridCellEditStopParams, event: MuiEvent) => { handleUpdateTitle }}
                  pageSizeOptions={[10]}
                  checkboxSelection
                  disableRowSelectionOnClick
                  autoHeight

                />
                {!!snackbar && (
                  <Snackbar
                    open
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                    onClose={handleCloseSnackbar}
                    autoHideDuration={6000}
                  >
                    <Alert {...snackbar} onClose={handleCloseSnackbar} />
                  </Snackbar>
                )}
              </Box>
            ) : (<Typography sx={{ fontSize: 24, margin: '12px auto', justifyContent: 'center', alignItems: 'center' }}>
              Loading...
            </Typography>)}

          </Grid>


        </Paper>
      </Grid>


  );
};

export default TodoApp