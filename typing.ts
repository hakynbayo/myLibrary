interface Ibook
{
  id: number | string;
  author: "string";
  dateRegistered: "number";
  age: number;
  email: "string";
  password: "string";
  address: "string";
  books?: book[]
}

interface book {
  id: string | number;
  name: string;
  isPublished: boolean;
  datePublished: null | string;
  serialNumber: null | string;
 }

export { Ibook };
