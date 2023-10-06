import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { listUsersInFirestore } from "../utils/firestoreUtils";

const Users = () => {
  const [users, setUsers] = useState<
    {
      id: string;
      name: string | null;
      email: string;
      urlPhoto: string | null;
      role: string;
    }[]
  >([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersData = await listUsersInFirestore();
        setUsers(usersData);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  const columns: GridColDef[] = [
    { field: "num", headerName: "#", width: 80 },
    { field: "name", headerName: "Nombre", width: 150 },
    { field: "email", headerName: "Correo electrónico", width: 250 },
    { field: "role", headerName: "Rol", width: 250 },
    { field: "urlPhoto", headerName: "Foto de perfil", width: 250 },
  ];

  const usersWithNumeration = users.map((user, index) => ({
    ...user,
    num: index + 1,
  }));

  return (
    <div style={{ height: 500, width: "100%" }}>
      <DataGrid rows={usersWithNumeration} columns={columns} />
    </div>
  );
};

export default Users;
