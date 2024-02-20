// Todo.js
import React, { useState, useEffect } from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import { Table, Button, Container } from 'react-bootstrap';
import TaskForm from './TaskForm';
import MainHeader from './MainHeader';


const Todo = () => {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await fetch('/get_tasks');
      if (response.ok) {
        const responseData = await response.json();
        const { tasks } = responseData;
        console.log(responseData);

        if (tasks) {
          setTasks(tasks);
        } else {
          console.error('No tasks found in response:', responseData);
        }
      } else {
        console.error('Failed to fetch tasks. Status:', response.status);
        if (response.status === 400) {
          window.location.href = "LoginPage";
        }
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const handleTaskSubmit = async (taskData) => {
    try {
      const response = await fetch('/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(taskData),
      });
      if (response.status === 200) {
        fetchTasks();
      } else {
        console.error('Failed to create task.');
      }
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  const mapPriorityLabel = (priorityValue) => {
    switch (priorityValue) {
      case 1:
        return '低 (Low)';
      case 2:
        return '中 (Medium)';
      case 3:
        return '高 (High)';
      default:
        return 'Unknown';
    }
  };

  const handleDelete = async (task_id) => {
    try {
      const response = await fetch(`/delete/${task_id}`, {
        method: 'DELETE',
      });
      if (response.status === 200) {
        console.log('Task deleted successfully!');
        fetchTasks();
      } else {
        console.error('Failed to delete task.');
      }
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  

  return (
    <div>
      <MainHeader />
      <Container className="mt-5">
        <TaskForm onSubmit={handleTaskSubmit} />

        {tasks.length > 0 && (
          <Table striped bordered hover className="mt-3">
            <thead>
              <tr>
                <th>Task Name</th>
                <th>Deadline</th>
                <th>Priority</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((task) => (
                <tr key={task.task_id}>
                  <td>{task.task_name}</td>
                  <td>{task.deadline ? new Date(task.deadline).toLocaleDateString() : 'No deadline'}</td>
                  <td>{mapPriorityLabel(task.priority)}</td>
                  <td>
                    <Button variant="danger" size="lg" onClick={() => handleDelete(task.task_id)}>
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}

        {tasks.length === 0 && <p>No tasks available.</p>}
      </Container>
    </div>
  );
};

export default Todo;
