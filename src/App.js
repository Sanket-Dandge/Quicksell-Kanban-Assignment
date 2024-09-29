import React, { useEffect, useState } from "react";
import './App.css';
import DoneSvg from './assets/Done.svg'; import PriorityIcon from './assets/Img - High Priority.svg'; import DisplaySvg from './assets/Display.svg';
import TagSvg from './assets/To-do.svg';
import AddSvg from './assets/add.svg';
import Dot3Svg from './assets/3 dot menu.svg';
import ToDoSvg from './assets/To-do.svg';
import InProgressSvg from './assets/in-progress.svg';
import BacklogSvg from './assets/Backlog.svg';
import CancelledSvg from './assets/Cancelled.svg';

const API_URL = 'https://api.quicksell.co/v1/internal/frontend-assignment';

const App = () => {
  const [grouping, setGrouping] = useState('Display');
  const [tickets, setTickets] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const statusIcons = {
    'Todo': ToDoSvg,
    'In Progress': InProgressSvg,
    'Done': DoneSvg,
    'Backlog': BacklogSvg,
    'Cancelled': CancelledSvg
  };

  useEffect(() => {
    fetch(API_URL).then((response) => response.json())
      .then((data) => {
        setTickets(data.tickets);
        setUsers(data.users);
        setLoading(false);
      }).catch((err) => console.error('Error fetching data:', err)); 
  }, []);
  
  const handleGroupingChange = (e) => {
    setGrouping(e.target.value);
  };

  const getGroupingTickets = () => {
    switch (grouping) {
      case 'Priority':
        return [...tickets].sort((a, b) => b.priority - a.priority);
      case 'Title':
        return [...tickets].sort((a, b) => a.title.localeCompare(b.title));
      default:
        return tickets;
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="kanban-board">
      <div className="kanban-header">
        <div className="kanban-filter">
          <img src={DisplaySvg} alt="DisplaySvg" />
          <select id="grouping" value={grouping} onChange={handleGroupingChange}>
            <option value="Status">Status</option>
            <option value="Priority">Priority</option>
            <option value="Title">Title</option> 
          </select> 
        </div>
      </div>
      <div className="kanban-sections">
        {['Todo', 'In Progress', 'Done', 'Backlog', 'Cancelled'].map((status) => (
          <div key={status} className="kanban-section">
            <div className="task-div">
              <h3 className="tagline">
                <img className="status-icon" src={statusIcons[status]} alt={`${status} Icon`} />
                {status}
              </h3>
              <div className="icons">
                <img className="icon" src={AddSvg} alt="AddSvg" />
                <img className="icon" src={Dot3Svg} alt="Dot3Svg" />
              </div>
            </div>
            {getGroupingTickets().filter((ticket) => ticket.status === status)
              .map((ticket) => (
                <div key={ticket.id} className="kanban-ticket">
                  <div className="ticket-header">
                    <span className="ticket-id">{ticket.id}</span>
                  </div>
                  <h4>{ticket.title}</h4>
                  <div className="ticket-info">
                    <img src={PriorityIcon} alt="Priority" className="priority-icon" />
                    <span className="ticket-tag">
                      <img src={TagSvg} alt="TagSvg" className="tag-icon" />
                      {ticket.tag}
                    </span>
                  </div>
                </div>
              ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
