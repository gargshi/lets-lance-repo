if (!localStorage.getItem('access_token') && !localStorage.getItem('user')) 
{				
	location.href = 'login-register.html';
}

const userName = document.getElementById('userName');
const userEmail = document.getElementById('userEmail');
const userRole = document.getElementById('userRole');

const userData = JSON.parse(localStorage.getItem('user'));
if (userData) {
	userName.textContent = userData.name;
	userEmail.textContent = userData.email;
	userRole.textContent = userData.role;
}

//const availableProjects = document.getElementById('availableProjects');
const lobbyProjects = document.getElementById('lobbyProjects');
async function fetchProjects() {
	lobbyProjects.innerHTML = '';
	const res = await fetch(`${API_BASE_URL}/projects`, {
		method: 'GET',
	});
	const projects = await res.json();
	projects.forEach(project => {
		//const li = document.createElement('li');
		const trc=document.createElement('tr');
		trc.innerHTML=`
			<td class="w-auto whitespace-nowrap">${project.title}</td>
			<td class="w-auto whitespace-nowrap">${project.created_by}</td>
			<td class="w-auto whitespace-nowrap hidden sm:table-cell">${project.created_at}</td>
			<td class="w-auto whitespace-nowrap hidden sm:table-cell">${project.status}</td>
			<td class="w-auto whitespace-nowrap">${project.budget}</td>
			<td class="w-auto whitespace-nowrap">
				<button class="bg-blue-600 text-white px-1 py-0 rounded hover:bg-blue-700" onclick='openModal(${JSON.stringify(project)})''>View</button>
			</td>
		`;
		lobbyProjects.appendChild(trc);
	});
}
fetchProjects();

const refreshProjectButton = document.getElementById('refreshProjectButton');
refreshProjectButton.addEventListener('click', () => {
	lobbyProjects.innerHTML = 'Refreshing..';
	//delay
	setTimeout(() => {
		fetchProjects();
	}, 5000);
});

const logoutButton = document.getElementById('logoutButton');
logoutButton.addEventListener('click', () => {
	localStorage.removeItem('user');
	localStorage.removeItem('access_token');
	location.href = 'login-register.html';
});

const addProjectButton = document.getElementById('addProjectButton');
addProjectButton.addEventListener('click', () => {
	location.href = 'add_project.html';
});

function openModal(project) {
	document.getElementById('modalTitle').textContent = project.title;
	document.getElementById('modalDesc').textContent = project.description;
	document.getElementById('modalClient').textContent = project.created_by;
	document.getElementById('modalStatus').textContent = project.status;
	document.getElementById('modalPostedDate').textContent = project.created_at;

	const modal = document.getElementById('projectModal');
	modal.classList.remove('hidden');
	modal.classList.add('flex');
	if (project.status === 'active') {
		const bidbtn=document.getElementById('bidButton');
		if (userData.name === project.created_by) {
			bidbtn.textContent = 'Delete Project';
			bidbtn.addEventListener('click', () => {
				//console.log('Deleting project:', project.id,"email:",userData.email);
				deleteProject(project,userData.email);
			});
		}
		else {
			bidbtn.textContent = 'Bid on Project';
		}
	}
}

function closeModal() {
	const modal = document.getElementById('projectModal');
	modal.classList.add('hidden');
	modal.classList.remove('flex');
}

async function fetchMessages(noteboard,type){			
	const noteBoard = document.getElementById(noteboard);				
	if(type === 'system'){
		noteBoard.innerHTML = '';
		const res = await fetch(`${API_BASE_URL}/messages/system/${userData.id}`, {
			method: 'GET',
		});
		const messages = await res.json();
		messages.forEach(message => {
			const li = document.createElement('li');
			li.className = 'flex justify-between items-center ';
			if(message.severity === 'normal' || message.severity === 'info'){
				li.className += 'bg-blue-100 dark:bg-blue-700 px-3 py-2 rounded';
				li.textContent = "INFO:";
			}
			else if(message.severity === 'success'){
				li.className += 'bg-green-100 dark:bg-green-700 px-3 py-2 rounded';
				li.textContent = "SUCCESS: ";
			}
			else if(message.severity === 'warning'){
				li.className += 'bg-yellow-100 dark:bg-yellow-700 px-3 py-2 rounded';
				li.textContent = "WARN: ";
			}
			else if(message.severity === 'error'){
				li.className += 'bg-red-100 dark:bg-red-700 px-3 py-2 rounded';
				li.textContent = "ERR: ";
			}
			li.textContent += message.content;
			const del_btn = document.createElement('button');
			del_btn.textContent = 'x';
			del_btn.className = 'bg-red-500 text-white px-1 py-0 rounded hover:bg-gray-700';
			del_btn.addEventListener('click', () => {
				deleteMessage(message.id,'system');
				//noteBoard.removeChild(li);
			});
			li.appendChild(del_btn);
			noteBoard.appendChild(li);				
		});
	}
}

/*setInterval(() => {
	fetchMessages('system');
}, 5000);*/
const refreshMessages = document.getElementById('refreshMessages');
refreshMessages.addEventListener('click', () => {
	setTimeout(() => {
		document.getElementById('systemMessages').innerHTML = 'Refreshing..';
		document.getElementById('userMessages').innerHTML = 'Refreshing..';
	}, 1000);
	setTimeout(() => {
		fetchMessages('systemMessages','system');
	}, 2000);
	//fetchMessages("systemMessages",'system');
});
fetchMessages('systemMessages','system');

async function deleteMessage(id,type){
	const res = await fetch(`${API_BASE_URL}/messages/${type}/delete/${id}`, {
		method: 'DELETE',
	});
	if(res.status === 200){
		fetchMessages('systemMessages',type);
		alert('Message deleted successfully');
	}
	else{
		alert('Error deleting message');
	}
}

async function deleteProject(project,email){
	if (userData.name !== project.created_by) {
		alert('You are not authorized to delete this project');
		return;
	}
	else{
		const res = await fetch(`${API_BASE_URL}/projects/delete/${project.id}/${email}`, {
			method: 'DELETE',
		});
		if(res.status === 200){						
			//alert('Project deleted successfully');
			location.reload();
		}
		else{
			alert('Error deleting project');
		}
	}
}