//Project Class

enum ProjectStatus { Active, Finished }

class Project {
    constructor(
        public id: string,
        public title: string,
        public description: string,
        public people: number,
        public status: ProjectStatus
    ) {

    }
}

type Listener = (items: Project[]) => void;

//Project State Management
class ProjectState {
    private listeners: Listener[] = [];
    private projects: Project[] = [];
    private static instance: ProjectState;

    private constructor() { }

    //Singleton
    static getInstance() {
        if (this.instance) {
            return this.instance;
        }
        this.instance = new ProjectState();
        return this.instance;
    }

    addListener(listenerFn: Listener) {
        this.listeners.push(listenerFn);
    }

    addProject(title: string, description: string, numOfPeople: number) {
        // const newProject = {
        //     id: Math.random().toString(),
        //     title: title,
        //     description: description,
        //     people: numOfPeople
        // };

        const newProject = new Project(
            Math.random().toString(),
            title,
            description,
            numOfPeople,
            ProjectStatus.Active
        );

        this.projects.push(newProject);

        for (const listenerFn of this.listeners) {
            listenerFn(this.projects.slice()); //copy
        }
    }
}

//This const will be globally accessible
const projectState = ProjectState.getInstance();

//Validation
interface Validatable {
    value: string | number;
    required?: boolean; //optional boolean or undefined
    minLength?: number;
    maxLength?: number;
    min?: number;
    max?: number;
}

function validate(validatetableInput: Validatable) {
    let isValid = true;
    if (validatetableInput.required) {
        isValid = isValid && validatetableInput.value.toString().trim().length !== 0;
    }

    if (validatetableInput.minLength != null && typeof validatetableInput.value === 'string') {
        isValid = isValid && validatetableInput.value.length >= validatetableInput.minLength
    }

    if (validatetableInput.maxLength != null && typeof validatetableInput.value === 'string') {
        isValid = isValid && validatetableInput.value.length <= validatetableInput.maxLength
    }

    if (validatetableInput.min != null && typeof validatetableInput.value === 'number') {
        isValid = isValid && validatetableInput.value >= validatetableInput.min;
    }

    if (validatetableInput.max != null && typeof validatetableInput.value === 'number') {
        isValid = isValid && validatetableInput.value <= validatetableInput.max;
    }
    return isValid;
}

//Autobind Decorator
function Autobind(_: any, _2: string, descriptor: PropertyDescriptor) { //since we dont used first 2 params so we define them as underscore so that typescript can understand that is it not used
    //access orignal method
    const originalMethod = descriptor.value;
    const adjustedDescriptor: PropertyDescriptor = {
        configurable: true,
        get() {
            const boundFunction = originalMethod.bind(this);
            return boundFunction;
        }
    };
    return adjustedDescriptor;
}

class ProjectList {
    templateElement: HTMLTemplateElement;
    hostElement: HTMLDivElement;
    element: HTMLElement;
    assignedProjects: any[];

    constructor(private type: 'active' | 'finished') { //Union Literal type 
        this.templateElement = document.getElementById('project-list')! as HTMLTemplateElement;
        this.hostElement = document.getElementById('app')! as HTMLDivElement;
        this.assignedProjects = [];

        const importedNode = document.importNode(this.templateElement.content, true);
        this.element = importedNode.firstElementChild as HTMLElement;
        this.element.id = `${this.type}-projects`;

        projectState.addListener((projects: Project[]) => {
            const relevantProjects = projects.filter(proj => {
                if (this.type === 'active') {
                    return proj.status = ProjectStatus.Active;
                }
                return proj.status = ProjectStatus.Finished;
            });
            this.assignedProjects = relevantProjects;
            this.renderProjects();
        });

        this.attach();
        this.renderContent();
    }

    private renderProjects() {
        const listEl = document.getElementById(`${this.type}-projects-list`)! as HTMLUListElement;
        listEl.innerHTML = '';
        for (const prjItem of this.assignedProjects) {
            const listItem = document.createElement('li');
            listItem.textContent = prjItem.title;
            listEl.appendChild(listItem);
        }
    }

    private renderContent() {
        const listId = `${this.type}-projects-list`;
        this.element.querySelector('ul')!.id = listId;
        this.element.querySelector('h2')!.textContent = this.type.toUpperCase() + ' PROJECTS';
    }

    private attach() {
        this.hostElement.insertAdjacentElement('beforeend', this.element);
    }

}

class ProjectInput {
    templateElement: HTMLTemplateElement;
    hostElement: HTMLDivElement;
    element: HTMLFormElement;
    titleInputElement: HTMLInputElement;
    descriptionInputElement: HTMLInputElement;
    peopleInputElement: HTMLInputElement;

    constructor() {
        //Way 1 typecasting 
        //this.templateElement = <HTMLTemplateElement>document.getElementById('project-input')!; // ! tells we will have that element for sure
        //Way 2 typecasting better way
        this.templateElement = document.getElementById('project-input')! as HTMLTemplateElement;
        this.hostElement = document.getElementById('app')! as HTMLDivElement;

        //Here we are getting the content of template element (the form inside the template element) and we are doing deep clone of it using importNode method
        const importNode = document.importNode(this.templateElement.content, true);
        //As we can not access the importnode from the constructor so created a accessible element which is Form type
        //We do this in construtor because we immediately want the element
        this.element = importNode.firstElementChild as HTMLFormElement;
        //Interacting with the element appending id
        this.element.id = 'user-input';

        this.titleInputElement = this.element.querySelector('#title') as HTMLInputElement;
        this.descriptionInputElement = this.element.querySelector('#description') as HTMLInputElement;
        this.peopleInputElement = this.element.querySelector('#people') as HTMLInputElement;

        this.configure();
        //execute attach method
        this.attach();
    }

    //Using Tuple
    private getUserInput(): [string, string, number] | void {
        const enteredTitle = this.titleInputElement.value;
        const enteredDescription = this.descriptionInputElement.value;
        const enteredPeople = this.peopleInputElement.value;

        const titleValidateable: Validatable = {
            value: enteredTitle,
            required: true
        }

        const descriptionValidatable: Validatable = {
            value: enteredDescription,
            required: true,
            minLength: 5
        }

        const peopleValidateable: Validatable = {
            value: +enteredPeople, //typecased
            required: true,
            min: 1,
            max: 5
        }

        if (
            !validate(titleValidateable) ||
            !validate(descriptionValidatable) ||
            !validate(peopleValidateable)
        ) {
            alert('Invalid Input, Please try again');
            return;
        } else {
            return [enteredTitle, enteredDescription, +enteredPeople];
        }
    }

    private clearInputs() {
        this.titleInputElement.value = '';
        this.descriptionInputElement.value = '';
        this.peopleInputElement.value = '';
    }

    //Using decorator
    @Autobind
    private submitHandler(event: Event) {
        event.preventDefault();
        //Get all users input as in return statement we are retirning it as Array
        const userInput = this.getUserInput();
        if (Array.isArray(userInput)) {
            //Array Destructure
            const [title, desc, people] = userInput;
            projectState.addProject(title, desc, people);
            console.log(title, desc, people);
            this.clearInputs();
        }
    }

    private configure() {
        //console.log(this);
        //this.element.addEventListener('submit', this.submitHandler.bind(this)); //one way of simply binding it
        this.element.addEventListener('submit', this.submitHandler);
    }

    private attach() {
        //Setting the element in the host div element afterbegin means just at the opening of host element
        this.hostElement.insertAdjacentElement('afterbegin', this.element);
    }


}

const prjInput = new ProjectInput();
const activePrjList = new ProjectList('active');
const finishedPrjList = new ProjectList('finished');
