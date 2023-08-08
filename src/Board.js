import React from 'react';
import Dragula from 'dragula';
import 'dragula/dist/dragula.css';
import Swimlane from './Swimlane';
import './Board.css';

export default class Board extends React.Component {
  constructor(props) {
    super(props);
    const clients = this.getClients();
    this.state = {
      clients: {
        backlog: clients.filter(client => !client.status || client.status === 'backlog'),
        inProgress: clients.filter(client => client.status && client.status === 'in-progress'),
        complete: clients.filter(client => client.status && client.status === 'complete'),
      }
    }
    this.swimlanes = {
      backlog: React.createRef(),
      inProgress: React.createRef(),
      complete: React.createRef(),
    }
  }

  componentDidMount() {
    // Set up dragula containers
    const containers = [this.swimlanes.backlog.current, this.swimlanes.inProgress.current, this.swimlanes.complete.current];
    this.drake = Dragula(containers, {
      isContainer: (el) => el.classList.contains('Swimlane'),
    });

    this.drake.on('drop', (el, target, source) => {
      this.handleClientDrop(el, target);
    });

  }

  handleClientDrop(droppedElement, targetSwimlane) {
    const clientId = droppedElement.dataset.id;
    const newStatus = targetSwimlane.dataset.status; // Get the new status from the target swimlane
    console.log(newStatus)
    // Update the client's status based on the newStatus
    const updatedClients = {
      ...this.state.clients,
      backlog: this.state.clients.backlog.map(client => (client.id === clientId ? { ...client, status: newStatus } : client)),
      inProgress: this.state.clients.inProgress.map(client => (client.id === clientId ? { ...client, status: newStatus } : client)),
      complete: this.state.clients.complete.map(client => (client.id === clientId ? { ...client, status: newStatus } : client)),
    };

    this.setState({ clients: updatedClients }, () => {
      // Get the updated status of the dragged client
      const updatedStatus = newStatus;

      // Update the background color of the dragged element based on the updated status
      switch (updatedStatus) {
        case 'backlog':
          droppedElement.style.backgroundColor = 'rgba(167, 158, 158, 0.671)';
          break;
        case 'in-progress':
          droppedElement.style.backgroundColor = 'skyblue';
          break;
        case 'complete':
          droppedElement.style.backgroundColor = 'rgb(150, 190, 150)';
          break;
        default:
          // Reset the background color if status is unknown
          droppedElement.style.backgroundColor = '';
          break;
      }
    });
  }


  getClientById(id) {
    return this.state.clients.backlog
      .concat(this.state.clients.inProgress, this.state.clients.complete)
      .find((client) => client.id === id);
  }

  getClients() {
    return [
      ['1','Stark, White and Abbott','Cloned Optimal Architecture', 'in-progress'],
      ['2','Wiza LLC','Exclusive Bandwidth-Monitored Implementation', 'complete'],
      ['3','Nolan LLC','Vision-Oriented 4Thgeneration Graphicaluserinterface', 'backlog'],
      ['4','Thompson PLC','Streamlined Regional Knowledgeuser', 'in-progress'],
      ['5','Walker-Williamson','Team-Oriented 6Thgeneration Matrix', 'in-progress'],
      ['6','Boehm and Sons','Automated Systematic Paradigm', 'backlog'],
      ['7','Runolfsson, Hegmann and Block','Integrated Transitional Strategy', 'backlog'],
      ['8','Schumm-Labadie','Operative Heuristic Challenge', 'backlog'],
      ['9','Kohler Group','Re-Contextualized Multi-Tasking Attitude', 'backlog'],
      ['10','Romaguera Inc','Managed Foreground Toolset', 'backlog'],
      ['11','Reilly-King','Future-Proofed Interactive Toolset', 'complete'],
      ['12','Emard, Champlin and Runolfsdottir','Devolved Needs-Based Capability', 'backlog'],
      ['13','Fritsch, Cronin and Wolff','Open-Source 3Rdgeneration Website', 'complete'],
      ['14','Borer LLC','Profit-Focused Incremental Orchestration', 'backlog'],
      ['15','Emmerich-Ankunding','User-Centric Stable Extranet', 'in-progress'],
      ['16','Willms-Abbott','Progressive Bandwidth-Monitored Access', 'in-progress'],
      ['17','Brekke PLC','Intuitive User-Facing Customerloyalty', 'complete'],
      ['18','Bins, Toy and Klocko','Integrated Assymetric Software', 'backlog'],
      ['19','Hodkiewicz-Hayes','Programmable Systematic Securedline', 'backlog'],
      ['20','Murphy, Lang and Ferry','Organized Explicit Access', 'backlog'],
    ].map(companyDetails => ({
      id: companyDetails[0],
      name: companyDetails[1],
      description: companyDetails[2],
      status: companyDetails[3],
    }));
  }
  renderSwimlane(name, clients, ref,status) {
    return (
      <Swimlane name={name} clients={clients} dragulaRef={ref} status={status} />
    );
  }

  render() {
    return (
      <div className="Board">
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-4">
              {this.renderSwimlane('Backlog', this.state.clients.backlog, this.swimlanes.backlog,'backlog')}
            </div>
            <div className="col-md-4">
              {this.renderSwimlane('In Progress', this.state.clients.inProgress, this.swimlanes.inProgress,'in-progress')}
            </div>
            <div className="col-md-4">
              {this.renderSwimlane('Complete', this.state.clients.complete, this.swimlanes.complete,'complete')}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
