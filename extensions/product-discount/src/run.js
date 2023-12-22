// @ts-check
import { DiscountApplicationStrategy } from "../generated/api";

/**
 * @typedef {import("../generated/api").RunInput} RunInput
 * @typedef {import("../generated/api").FunctionRunResult} FunctionRunResult
 */

/**
 * @type {FunctionRunResult}
 */
const EMPTY_DISCOUNT = {
  discountApplicationStrategy: DiscountApplicationStrategy.First,
  discounts: [],
};

let targets = [];
let value = {};
let msg = '';
let lineCount = 0;
let discountApplicationStrategy = DiscountApplicationStrategy.Maximum;
let excludeProductArray = [
  // "gid://shopify/Product/8118580740259",
  // "gid://shopify/Product/8118579462307",
  // "gid://shopify/Product/8118580183203",
  // "gid://shopify/Product/7834607419555",
  // "gid://shopify/Product/7834607747235",
  // "gid://shopify/Product/7834608042147",
  // "gid://shopify/Product/7834608861347",
  // "gid://shopify/Product/7834609025187",
  // "gid://shopify/Product/7956057587875",
  // "gid://shopify/Product/7956058570915",
  // "gid://shopify/Product/7956059685027",
  // "gid://shopify/Product/7956061421731",
  // "gid://shopify/Product/7999205310627",
  // "gid://shopify/Product/7843306569891",
  // "gid://shopify/Product/7843257581731"
];

/**
 * @param {RunInput} input
 * @returns {FunctionRunResult}
 */
export function run(input) {
  console.log('=> run....');
  let tagList = input.cart.buyerIdentity?.customer?.metafield?.value ?? "";
  const configuration = JSON.parse(
    input?.discountNode?.metafield?.value ?? "{}"
  );

  let inputArray = input.cart.lines;

  var finalArray = inputArray.filter((line) => {
    if(line.merchandise.productType != 'CustomProduct') {
      if(line.merchandise.product.isGiftCard != true) {
        if(line.merchandise.product.productType != 'Gift Card' && line.merchandise.product.productType != 'Gift_Card' && line.merchandise.product.productType != 'gift_card') {
          if(line.cost.amountPerQuantity.amount != 0) {
            if(tagList.includes('TAPL-EMP') || tagList.includes('FNF')) {
              return line;
            } else {
              if(!excludeProductArray.includes(line.merchandise.product.id)) {
                lineCount += Number(line.quantity);
                return line;
              }
            }
          }
        }
      }
    }
    return;
  });

  let spentAmount = input.cart.buyerIdentity?.customer?.amountSpent.amount ? input.cart.buyerIdentity?.customer?.amountSpent.amount : 0;

  if(tagList.includes('TAPL-EMP')) {
    msg = "Employee discount!";
        value = {
          percentage: {
            value: 50
          }
        };
        discountApplicationStrategy = DiscountApplicationStrategy.First;
        let tempArray = [];

        targets = finalArray.map((line) => {
          if(!line.merchandise.product.isGiftCard) {
            tempArray.push(line.merchandise.id.replace("gid://shopify/ProductVariant/", ""));
            return ({
              productVariant: {
                id: line.merchandise.id,
              }
            });
          }
        });
  } else if(tagList.includes('FNF')) {
    msg = "FNF discount!";
        value = {
          percentage: {
            value: 20
          }
        };
        discountApplicationStrategy = DiscountApplicationStrategy.First;
        let tempArray = [];

        targets = finalArray.map((line) => {
          if(!line.merchandise.product.isGiftCard) {
            tempArray.push(line.merchandise.id.replace("gid://shopify/ProductVariant/", ""));
            return ({
              productVariant: {
                id: line.merchandise.id,
              }
            });
          }
        });

  } else {
    // msg = "5 Plus 1";
    // discountApplicationStrategy = DiscountApplicationStrategy.Maximum;


    // if(lineCount > 0) {
    //   let discountProductCount = Math.floor(lineCount/6);

    //   let totalCartLines = finalArray;
    //   if(discountProductCount > 0) {
    //     totalCartLines.sort((first, second) => {
    //       return first.cost.amountPerQuantity.amount - second.cost.amountPerQuantity.amount;
    //     });

    //     var totalDiscounts = 0;
    //     var totalDiscountsQuantity = 0;
    //     var discountProductArray = {};

    //     for (let index = 1; index <= discountProductCount; index++) {      
    //       if (typeof totalCartLines[index-1] != 'undefined') {
    //         if(!totalCartLines[index-1].merchandise.product.isGiftCard) {
    //           if(totalDiscountsQuantity == discountProductCount) {
    //             break;
    //           } else {
    //             var quantity = 1;              
    //             if(totalCartLines[index-1].quantity <= (discountProductCount - totalDiscountsQuantity)) {
    //               console.log('=> '+totalCartLines[index-1].quantity);
    //               quantity = totalCartLines[index-1].quantity;
    //             } else {
    //               quantity = Number(discountProductCount) - Number(totalDiscountsQuantity);
    //             }
  
    //             totalDiscountsQuantity = Number(totalDiscountsQuantity) + Number(quantity);
  
    //             if(totalCartLines[index-1].merchandise.id in discountProductArray) {
    //               console.log(' in if => ' + discountProductArray[totalCartLines[index-1].merchandise.id]);
    //               discountProductArray[totalCartLines[index-1].merchandise.id] = Number(discountProductArray[totalCartLines[index-1].merchandise.id]) + Number(quantity);
    //             } else {
    //               discountProductArray[totalCartLines[index-1].merchandise.id] = Number(quantity);
    //             }
    //           }
    //         }
    //       }
    //     }

    //     for (let key in discountProductArray) {
    //       targets.push({
    //         productVariant: {
    //           id: key,
    //           quantity: discountProductArray[key]
    //         }
    //       });
    //     }

    //     totalDiscounts = 0;
        
    //     let productIds = Object.keys(discountProductArray);

    //     productIds.filter((element) => {
    //       let matchArray = [];
    //       totalCartLines.forEach(item => {
    //         if(!matchArray.includes(item.merchandise.id)) {
    //           if(element == item.merchandise.id) {
    //             matchArray.push(element);
    //             if(item.cost.amountPerQuantity.amount > 400000) {
    //               totalDiscounts = Number(totalDiscounts) + Number(400000 * Number(discountProductArray[element]));
    //             } else {
    //               totalDiscounts = Number(totalDiscounts) + Number(item.cost.amountPerQuantity.amount * Number(discountProductArray[element]));
    //             }
    //           }
    //         }
    //       });
    //     });

    //     value = {
    //       fixedAmount: {
    //         amount: totalDiscounts
    //         // appliesToEachItem: true
    //       }
    //     };
    //   } else {
    //     // console.log('in 15');
    //     // if(spentAmount <= 0) {
    //     //   value = {
    //     //     percentage: {
    //     //       value: 15
    //     //     }
    //     //   };
    //     //   msg = "Welcome 15";
    //     //   discountApplicationStrategy = DiscountApplicationStrategy.Maximum;
    //     //   let tempArray = [];

    //     //   targets = finalArray.map((line) => {
    //     //     if(!line.merchandise.product.isGiftCard) {
    //     //       tempArray.push(line.merchandise.id.replace("gid://shopify/ProductVariant/", ""));
    //     //       return ({
    //     //         productVariant: {
    //     //           id: line.merchandise.id,
    //     //         }
    //     //       });
    //     //     }
    //     //   });
    //     // }
    //   }
    // }
  }
  if (!targets.length) {
    console.error("No cart lines qualify for discount.");
    return EMPTY_DISCOUNT;
  }

  return {
    discounts: [
      {
        targets,
        value: value,
        message: msg
      }
    ],
    discountApplicationStrategy: discountApplicationStrategy,
  };
};