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
    const orignalMethod = descriptor.value;
    const adjustedDescriptor: PropertyDescriptor = {
        configurable: true,
        get() {
            const boundFunction = orignalMethod.bind(this);
            return boundFunction;
        }
    };
    return adjustedDescriptor;
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

        const descripionValidateable: Validatable = {
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
            !validate(descripionValidateable) ||
            !validate(peopleValidateable)
        ) {
            alert('Invalid Input, Please try again');
            return;
        } else {
            console.log(enteredTitle, enteredDescription, enteredPeople);
        }

        return;
    }

    //Using decorator
    @Autobind
    private submitHandler(event: Event) {
        event.preventDefault();
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