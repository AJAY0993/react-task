type Address = {
    street: string;
    city: string;
    suite?: string
};

type Company = {
    name?: string;
    bs?: string;
    catchPhrase?: string
}

// User Type 
export type User = {
    id?: number;
    name: string;
    email: string;
    phone: string;
    username: string;
    address: Address;
    company?: Company;
    website?: string;
};

// User Form Type
export type UserForm = {
    id?: number;
    name: string;
    email: string;
    phone: string;
    username: string;
    street: string;
    city: string;
    company?: string;
    website?: string;
}