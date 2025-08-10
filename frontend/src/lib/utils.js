// export const capitialize = (str) => str.charAt(0).toUpperCase() + str.slice(1);



export const capitialize = (str) => {
  if (!str || typeof str !== "string") return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
};
