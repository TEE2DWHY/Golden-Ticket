import { useQuery } from "@tanstack/react-query";
import api from "../lib/axios";
import type { Inventory } from "../types/inventory";

const getInventory = async (): Promise<Inventory[]> => {
    const response = await api.get("/inventory");

    return response.data.data.products ?? [];
};

export const useInventory = () => {
    return useQuery({
        queryKey: ["inventory"],
        queryFn: getInventory,
        staleTime: 5000,
        refetchOnWindowFocus: true
    });
};