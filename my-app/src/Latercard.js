import React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button"; // Import the Button component
import './App.css';  
function LaterCard({ item, index, handlePayClick }) {
    // Add this line to inspect the 'item' object
  return (
    <Card key={index} style={{backgroundColor: "#ccccff"}}>
      <CardContent>
        <Typography variant="h6">Name:{item.topic}</Typography>
        <Typography variant="body2" color="textSecondary">
          Cost: ${item.cost}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Count: {item.count}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Total: ${item.cost*item.count}        
         
        </Typography>
        <Button variant="contained" className="cart-button"  onClick={() => handlePayClick(item.id)}>
          Pay
        </Button>

      </CardContent>
    </Card>
  );
}
export default LaterCard;
