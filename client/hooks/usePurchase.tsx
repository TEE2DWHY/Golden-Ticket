import api from "@/lib/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Receipt } from "../types/inventory";

type PurchasePayload = {
    productId: string;
    quantity: number;
};

const purchaseTicket = async (payload: PurchasePayload): Promise<Receipt> => {
    const response = await api.post("/buy", payload);
    return response.data.data;
};

export const usePurchase = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: purchaseTicket,

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["inventory"]
            });
        }
    });
};