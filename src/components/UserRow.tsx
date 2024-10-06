import { Dispatch, SetStateAction } from "react";
import { User } from "../types";
import { FiDelete } from "react-icons/fi";
import { PiPencil } from "react-icons/pi";
import ModalProvider, { useModalContext } from "./Modal";
import { deleteUser } from "../api";
import Form from "./Form";
import { Link } from "react-router-dom";

function UserRow({
  user,
  setUsers,
  index,
}: {
  user: User;
  setUsers: Dispatch<SetStateAction<User[]>>;
  index: number;
}) {
  const { close: closeModal } = useModalContext(); // Hook to close the modal

  // Function to delete the user from the list
  const deleteRow = async () => {
    if (user.id) {
      await deleteUser(user.id.toString()); // Call API to delete the user
      closeModal(); // Close the modal after deletion
      setUsers((users) =>
        users?.filter((currentUser) => currentUser.id !== user.id),
      ); // Update the user list
    }
  };

  const isEven = index % 2 === 0; // Determine if the row is even or odd for background color
  const bg = isEven ? "#16A085" : "#2C3E50"; // Apply alternating background colors

  return (
    <li className="w-full flex p-2" role="row" style={{ backgroundColor: bg }}>
      {/* User ID */}
      <div
        className="min-w-6 text-white border-r-[1px] text-center"
        role="column"
      >
        {user.id}
      </div>

      {/* User name with a link to their profile */}
      <div
        className="flex-1 text-white border-r-[1px] text-center"
        role="column"
      >
        <Link
          className="underline"
          to={user.id?.toString() || ""}
          state={{ user }}
        >
          {user.name}
        </Link>
      </div>

      {/* User email, hidden on small screens */}
      <div
        className="flex-1 text-white text-center hidden md:block"
        role="column"
      >
        {user.email}
      </div>

      {/* Action buttons for updating and deleting the user */}
      <div className="text-white text-center" role="column">
        <div className="flex items-center gap-2 ml-4 md:ml-0">
          {/* Open delete modal */}
          <ModalProvider.Open id={"delete" + user.id}>
            <button>
              <FiDelete />
            </button>
          </ModalProvider.Open>

          {/* Delete confirmation modal */}
          <ModalProvider.Window id={"delete" + user.id}>
            <div className="bg-white rounded-md p-4">
              <p className="mb-12">
                Are you sure you want to delete {user.name}?
              </p>
              <div className="flex gap-2 w-fit ml-auto">
                <button
                  className="rounded p-2 min-w-24 text-center bg-black text-white"
                  onClick={closeModal}
                >
                  Cancel
                </button>
                <button
                  className="rounded p-2 min-w-24 text-center bg-red-600 text-white"
                  onClick={deleteRow}
                >
                  Delete
                </button>
              </div>
            </div>
          </ModalProvider.Window>

          {/* Open update modal */}
          <ModalProvider.Open id={"update" + user.id}>
            <button>
              <PiPencil />
            </button>
          </ModalProvider.Open>

          {/* Update user form modal */}
          <ModalProvider.Window id={"update" + user.id}>
            <Form mode="update" user={user} setUsers={setUsers} />{" "}
            {/* Pass user and setUsers to form for update */}
          </ModalProvider.Window>
        </div>
      </div>
    </li>
  );
}

export default UserRow;
