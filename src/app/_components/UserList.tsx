"use client";

import { RouterOutputs } from "@/server";
import { useState } from "react";
import { trpc } from "../_trpc/client";

type UserListProps = {
  initialUsers: RouterOutputs["getUsers"];
};

export default function UserList({ initialUsers }: UserListProps) {
  const getUsers = trpc.getUsers.useQuery(undefined, {
    initialData: initialUsers,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });

  const addUser = trpc.addUser.useMutation({
    onSettled: () => {
      getUsers.refetch();
    },
  });

  const removeUser = trpc.removeUser.useMutation({
    onSettled: () => {
      getUsers.refetch();
    },
  });

  const [firstName, setFirstName] = useState("");

  return (
    <div>
      {getUsers?.data && (
        <ul className="text-white my-5 text-3xl">
          {getUsers.data.map((user) => (
            <li key={user.id} className="list-decimal list-inside">
              {user.firstName}
              <button
                type="button"
                className="ml-4 text-base bg-red-500 hover:bg-red-700 text-white py-2 px-4 rounded-full"
                onClick={async () => {
                  removeUser.mutate(user.id);
                }}
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}
      <div className="flex gap-3 items-center">
        <label htmlFor="firstName">First name</label>
        <input
          id="firstName"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          className="flex-grow text-black bg-white rounded-md border-gray-300"
        />
        <button
          type="button"
          onClick={async () => {
            if (!firstName.length) return;

            addUser.mutate(firstName);
            setFirstName("");
          }}
          className="bg-slate-500 hover:bg-slate-700 text-white py-2 px-4 rounded-full"
        >
          Add User
        </button>
      </div>
    </div>
  );
}
