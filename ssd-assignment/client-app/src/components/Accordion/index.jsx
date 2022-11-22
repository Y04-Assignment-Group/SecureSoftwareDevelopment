import { ArrowForwardIosSharp } from "@mui/icons-material";
import { Accordion, AccordionDetails, AccordionSummary, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useState } from "react";

const CustomAccordion = styled((props) => (
  <Accordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  "&:not(:last-child)": {
    borderBottom: 0,
  },
  "&:before": {
    display: "none",
  },
}));

const CustomAccordionSummary = styled((props) => (
  <AccordionSummary expandIcon={<ArrowForwardIosSharp sx={{ fontSize: "0.9rem" }} />} {...props} />
))(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === "dark" ? "rgba(255, 255, 255, .05)" : "rgba(0, 0, 0, .03)",
  flexDirection: "row-reverse",
  "& .MuiAccordionSummary-expandIconWrapper.Mui-expanded": {
    transform: "rotate(90deg)",
  },
  "& .MuiAccordionSummary-content": {
    marginLeft: theme.spacing(1),
  },
}));

const CustomAccordionDetails = styled(AccordionDetails)(({ theme }) => ({
  padding: theme.spacing(2),
  borderTop: "1px solid rgba(0, 0, 0, .125)",
}));

const NewAccordion = (props) => {
  const [state, setState] = useState({
    expandPannel: 0,
  });

  const handleChange = (panel) => (event, newExpanded) => {
    setState({ ...state, expandPannel: newExpanded ? panel : false });
  };
  return (
    <>
      {props.messages &&
        props.messages.length > 0 &&
        props.messages.map((message, index) => (
          <CustomAccordion
            expanded={state.expandPannel === index}
            onChange={handleChange(index)}
            key={index}
          >
            <CustomAccordionSummary aria-controls="panel1d-content" id="panel1d-header">
              <Typography>Message #{index + 1}</Typography>
            </CustomAccordionSummary>
            <CustomAccordionDetails>
              <Typography>{message.message}</Typography>
            </CustomAccordionDetails>
          </CustomAccordion>
        ))}
    </>
  );
};
export default NewAccordion;
