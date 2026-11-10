import { useQuery } from "@tanstack/react-query";
import api from "../lib/axios";


const getProduct = async(productId: string) =>{
    const response = await api.post(`/inventory/${productId}`)
     console.log(response.data);
    return response.data.data.products;
}

export const useProduct = (productId: string) =>{
    return useQuery({
        queryKey: ["product"],
        queryFn: ()=> getProduct(productId),
        enabled: !!productId,
        staleTime: 5000,
        refetchOnWindowFocus: true

    })
}
