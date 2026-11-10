export const hasStock = (productQuantity:number, requestedQuantity: number) : boolean =>{
    return productQuantity >=requestedQuantity
}