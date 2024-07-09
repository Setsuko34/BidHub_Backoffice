import React, {useEffect, useState} from "react";
import {DataGrid, GridToolbar} from "@mui/x-data-grid";
import {Box, Typography} from "@mui/material";
import {GetEncheres} from "./EncheresLogic";

const EncheresList = (idArticle, haveEncheres) => {
  const [encheres, setEncheres] = useState([]);
  useEffect(() => {
    //GetEncheres(idArticle, setEncheres);
    console.log(haveEncheres);
    setEncheres(haveEncheres);
  }, [idArticle]);

  if (encheres.length === 0) {
    return <Typography>Aucune enchère pour cet article</Typography>;
  }

  return (
    <Box>
      <DataGrid
        columns={[
          {field: "date_enchere", headerName: "Date enchère", flex: 1},
          {field: "id_user", headerName: "ID utilisateur", flex: 1},
          {field: "montant", headerName: "Montant", flex: 1},
        ]}
        rows={encheres}
        getRowId={(row) =>
          row.id_articles + row.id_user + row.date_enchere.seconds
        }
        // assuming this combination is unique for each row
        pageSize={5}
        slots={{toolbar: GridToolbar}}
        slotProps={{
          toolbar: {
            showQuickFilter: true,
          },
        }}
      />
    </Box>
  );
};

export default EncheresList;
