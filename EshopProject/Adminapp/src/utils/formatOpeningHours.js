 const formatOpeningHours = (openingHours) => {
    openingHours.forEach((element) => {
     if (Number(element.from.split(":")[0]) <= 12) {
       element.from = `${element.from} AM`;
     } else {
       element.from = `${element.from} PM`;
     }
 
     if (Number(element.to.split(":")[0]) <= 12) {
       element.to = `${element.to} AM`;
     } else {
       const diff = Number(element.to.split(":")[0]) - 12;
       element.to = `${diff}:${element.to.split(":")[1]} PM`;
     }
 
     element.day = element.day.slice(0, 3);
  });
  return openingHours;
};

export default formatOpeningHours;