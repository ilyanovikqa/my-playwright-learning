const retries: string = "five";
const user = { email: "john@test.com" };
console.log(user.email);

function getTimeout(seconds: number): number {
  return seconds * 1000;
}

const config = { baseURL: "https://staging.example.com" };
console.log(config.baseURL);

function printName(name: string) {
  console.log(name);
}
const userName: string | undefined = undefined;
if (userName !== undefined)
printName(userName); 


type Product = {
  name: string;
  price: number;
  inStock: boolean;
};

const product1: Product = {
  name: "Wireless Headphones",
  price: 49.99,
  inStock: true,
};

const product2: Product = {
  name: "Mechanical Keyboard",
  price: 129.99,
  inStock: false,
};


function formatPrice(price: number): string {
  return `$${price.toFixed(2)}`;
}

console.log(formatPrice(product1.price));
console.log(formatPrice(product2.price));