import { AddCircleOutline, RemoveCircleOutline } from "@mui/icons-material";
import { IconButton, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { FC } from "react";

interface Props {
  currentValue: number;
  maxValue: number;
  handleUpdateCount: (value: number) => void;
}

export const ItemCounter: FC<Props> = ({ currentValue, maxValue, handleUpdateCount }) => {
  const handleAdd = () => {
    currentValue < maxValue && handleUpdateCount(1);
  };

  const handleMinus = () => {
    currentValue > 1 && handleUpdateCount(-1);
  };

  return (
    <Box display="flex" alignItems="center">
      <IconButton onClick={handleMinus}>
        <RemoveCircleOutline />
      </IconButton>

      <Typography sx={{ width: 40, textAlign: "center" }} component="p">
        {currentValue}
      </Typography>

      <IconButton onClick={handleAdd}>
        <AddCircleOutline />
      </IconButton>
    </Box>
  );
};
