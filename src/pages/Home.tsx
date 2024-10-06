import { useEffect, useState } from "react";
import UserRow from "../components/UserRow";
import { getUsers } from "../api";
import { User } from "../types";
import ModalProvider from "../components/Modal";
import Form from "../components/Form";
import { GoGear } from "react-icons/go";
import Skeleton from "../components/Skeleton";
import toast from "react-hot-toast";

function Home() {
  const [isLoading, setLoading] = useState<boolean>(true); // Track loading state
  const [users, setUsers] = useState<User[]>([]); // Store all user data
  const [visibleUsers, setVisibleUsers] = useState<User[]>([]); // Store filtered users

  // Filter users based on the query input (search)
  function filter<T>(query: T): void {
    if (typeof query === "string") {
      if (!query) {
        setVisibleUsers(users);
      } else {
        setVisibleUsers(
          users.filter((user) =>
            user.name.toLowerCase().startsWith(query.toLowerCase()),
          ),
        );
      }
    }
  }

  // Debouncer to delay the search for better performance
  const debouncer = <T,>(fn: (arg: T) => void, time: number = 200) => {
    let timerId: ReturnType<typeof setTimeout>;
    return (arg: T) => {
      clearTimeout(timerId);
      timerId = setTimeout(() => fn(arg), time);
    };
  };

  const handleChange = debouncer<string>(filter, 300); // Apply debounce to search input

  // Sort users by ID or name
  const sort = (sortBy: string) => {
    if (!["id", "AZ", "ZA"].includes(sortBy)) return;
    if (sortBy === "id") {
      setVisibleUsers(
        [...visibleUsers].sort((a, b) => {
          if (a.id && b.id) {
            return a.id - b.id;
          }
          return 0;
        }),
      );
    } else {
      setVisibleUsers(
        [...visibleUsers].sort((a, b) => {
          const nameA = a.name.toLowerCase();
          const nameB = b.name.toLowerCase();
          if (nameA < nameB) {
            return sortBy === "AZ" ? -1 : 1;
          } else if (nameA > nameB) {
            return sortBy === "ZA" ? -1 : 1;
          } else {
            return 0;
          }
          return 0;
        }),
      );
    }
  };

  // Fetch users on component mount
  useEffect(() => {
    (async function () {
      try {
        setLoading(true);
        const users = await getUsers();
        setUsers(users);
        setLoading(false);
      } catch (error) {
        const err = error as Error;
        toast.error(err.message);
      }
    })();
  }, []);
  useEffect(() => {
    (async function () {
      setVisibleUsers(users); // Initialize visible users
    })();
  }, [users]);

  return (
    <div>
      {/* Search and sorting controls */}
      <div className="flex justify-between gap-2 p-2">
        <input
          className="input"
          placeholder="Search"
          onChange={(e) => handleChange(e.target.value)}
        />
        <select
          className="bg-black text-white rounded focus:outline-none p-2 cursor-pointer"
          defaultValue="id"
          onChange={(e) => sort(e.target.value)}
        >
          <option value="id">Sort by id</option>
          <option value="AZ">Sort by name (A-Z)</option>
          <option value="ZA">Sort by name (Z-A)</option>
        </select>
      </div>

      {/* Table header */}
      <header>
        <div className="w-full flex bg-[#2C3E50]  p-2 " role="row">
          <div
            className="min-w-6  text-white border-r-[1px] text-center"
            role="column"
          >
            Id
          </div>
          <div
            className="flex-1 text-white border-r-[1px] text-center"
            role="column"
          >
            Name
          </div>
          <div
            className="flex-1 text-white text-center hidden md:block"
            role="column"
          >
            Email
          </div>
          <div className="text-white text-center ml-4 md:ml-0" role="column">
            <GoGear />
          </div>
        </div>
      </header>

      {/* User list or skeleton loading */}
      <ul role="table">
        {isLoading && [1, 1, 1, 1, 1, 1, 1].map(() => <Skeleton />)}{" "}
        {/* Show skeleton loading when data is being fetched */}
        {users &&
          visibleUsers.length > 0 &&
          visibleUsers.map((user, i) => (
            <UserRow user={user} key={user.id} setUsers={setUsers} index={i} />
          ))}
      </ul>

      {/* Modal for creating new user */}
      <ModalProvider.Open id={"create"}>
        <button className="w-[90%] mx-auto block mt-4 rounded p-2 min-w-24 text-center bg-blue-400 text-white">
          Create
        </button>
      </ModalProvider.Open>
      <ModalProvider.Window id={"create"}>
        <Form mode="create" setUsers={setUsers} />
      </ModalProvider.Window>
    </div>
  );
}

export default Home;
