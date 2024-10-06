import { Dispatch, SetStateAction, useState } from "react";
import { useForm } from "react-hook-form";
import {
  validateCompanyName,
  validateEmail,
  validatePhone,
  validateWebsite,
} from "../utils";
import { User, UserForm } from "../types";
import Error from "./Error";
import {
  createUser as createUserApi,
  updateUser as updateUserApi,
} from "../api";
import { useModalContext } from "./Modal";

function Form({
  mode,
  user,
  setUsers,
  setUser,
}: {
  mode: "create" | "update";
  user?: User;
  setUsers?: Dispatch<SetStateAction<User[]>>;
  setUser?: Dispatch<SetStateAction<User>>;
}) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { close } = useModalContext();

  // Set default values based on the mode
  const defaultValues =
    mode === "create"
      ? { username: "USER-name" }
      : {
          name: user?.name,
          email: user?.email,
          phone: user?.phone,
          username: user?.username,
          street: user?.address.street,
          city: user?.address.city,
          company: user?.company?.name,
          website: user?.website,
        };

  // Use react-hook-form for form handling
  const { register, handleSubmit, formState, reset } = useForm<UserForm>({
    defaultValues,
  });

  // Submit function to handle API calls
  const submit = async (user: UserForm) => {
    const body: User = {
      name: user.name,
      email: user.email,
      phone: user.phone,
      username: user.username,
      address: {
        city: user.city,
        street: user.street,
      },
      company: {
        name: user.company,
      },
      website: user.website,
    };

    setIsLoading(true); // Set loading state before API calls
    try {
      if (mode === "create") {
        const newUser = await createUserApi(body); // Create user
        setUsers?.((users) => [...users, newUser]); // Update users state
      } else if (mode === "update") {
        const updatedUser = await updateUserApi(body); // Update user
        if (setUser !== undefined) {
          setUser(updatedUser);
        } else if (setUsers !== undefined) {
          setUsers((users) =>
            users.map((currentUser) =>
              currentUser.id !== updatedUser.id ? currentUser : updatedUser,
            ),
          );
        }
      }
    } catch (error) {
      console.error("Error occurred during submission:", error);
      // Consider adding error handling logic here (e.g., displaying a notification)
    } finally {
      setIsLoading(false); // Reset loading state
      close(); // Close modal after submission
      reset(); // Reset form fields
    }
  };

  const { errors } = formState;

  return (
    <div className="w-full max-w-[600px] rounded-md p-4 bg-white">
      <form className="w-full" onSubmit={handleSubmit(submit)}>
        {/* User Info Fields */}
        <div className="w-full flex gap-2 my-4">
          <div className="grow">
            <label className="label" htmlFor="name">
              Name:
            </label>
            <input
              id="name"
              className="input"
              {...register("name", {
                required: "Name is required",
                minLength: {
                  value: 3,
                  message: "Name must be of minimum 3 characters",
                },
              })}
              placeholder="Name"
            />
            <Error
              message={errors.name?.message || ""}
              show={Boolean(errors.name)}
            />
          </div>
          <div className="grow">
            <label className="label" htmlFor="email">
              Email
            </label>
            <input
              className="input"
              id="email"
              {...register("email", {
                required: "Email is required",
                validate: validateEmail || "Invalid email",
              })}
              placeholder="Email"
            />
            <Error
              message={errors.email?.message || ""}
              show={Boolean(errors.email)}
            />
          </div>
        </div>

        {/* Additional Fields */}
        <div className="w-full flex gap-2 my-4 flex-wrap">
          <div className="grow">
            <label className="label" htmlFor="username">
              User Name
            </label>
            <input
              className="input"
              id="username"
              {...register("username", {
                required: "Username is required",
                minLength: {
                  value: 3,
                  message: "User name must be 3 characters long",
                },
              })}
              disabled={mode === "update"}
              placeholder="Username"
            />
            <Error
              message={errors.username?.message || ""}
              show={Boolean(errors.username)}
            />
          </div>
          <div className="grow">
            <label className="label" htmlFor="phone">
              Phone
            </label>
            <input
              className="input"
              id="phone"
              {...register("phone", {
                required: "Phone is required",
                validate: (value) => validatePhone(value) || "Invalid phone", // Validation function inline
              })}
              placeholder="Phone"
            />
            <Error
              message={errors.phone?.message || ""}
              show={Boolean(errors.phone)}
            />
          </div>
        </div>

        {/* Address Fields */}
        <div className="w-full">
          <h4 className="font-semibold text-lg mb-2">Address</h4>
          <div className="w-full flex gap-2">
            <div className="grow">
              <label className="label" htmlFor="street">
                Street
              </label>
              <input
                className="input"
                id="street"
                {...register("street", {
                  required: "Street is required",
                })}
                placeholder="Street"
              />
              <Error
                message={errors.street?.message || ""}
                show={Boolean(errors.street)}
              />
            </div>
            <div className="grow">
              <label className="label" htmlFor="city">
                City
              </label>
              <input
                className="input"
                id="city"
                {...register("city", {
                  required: "City is required",
                })}
                placeholder="City"
              />
              <Error
                message={errors.city?.message || ""}
                show={Boolean(errors.city)}
              />{" "}
              {/* Corrected from errors.name */}
            </div>
          </div>
        </div>

        {/* Company and Website Fields */}
        <div className="w-full flex gap-2 my-4">
          <div className="grow">
            <label className="label" htmlFor="company">
              Company
            </label>
            <input
              id="company"
              className="input"
              {...register("company", {
                validate: (value) =>
                  validateCompanyName(value) ||
                  "Company name must be 3 characters long",
              })}
              placeholder="Company"
            />
            <Error
              message={errors.company?.message || ""}
              show={Boolean(errors.company)}
            />
          </div>
          <div className="grow">
            <label className="label" htmlFor="website">
              Website
            </label>
            <input
              className="input"
              id="website"
              {...register("website", {
                validate: (value) =>
                  validateWebsite(value) || "Invalid website URL", // Added value parameter for validation function
              })}
              placeholder="Website"
            />
            <Error
              message={errors.website?.message || ""}
              show={Boolean(errors.website)}
            />
          </div>
        </div>

        <button
          className="w-full text-white rounded bg-black font-medium text-lg p-2"
          disabled={isLoading}
        >
          {isLoading
            ? mode === "create"
              ? "Creating"
              : "Updating"
            : mode === "create"
              ? "Create"
              : "Update"}
        </button>
      </form>
    </div>
  );
}

export default Form;
