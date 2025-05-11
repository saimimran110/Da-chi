import React, { useEffect, useState } from 'react';
import PageLayout from '@/components/layout/PageLayout';
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { fetchOrders } from '@/assets/data'; // Import the fetchOrders API function
import { toast } from 'sonner';

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
   const userId = localStorage.getItem("userId"); // Replace with the actual user ID from your authentication context or state
   console.log('fetching orders for :', userId); // Log the user ID for debugging
    const loadOrders = async () => {
      try {
        const fetchedOrders = await fetchOrders(userId); // Fetch orders from the API
        console.log('Fetched Orders:', fetchedOrders); // Log the fetched orders for debugging
        setOrders(fetchedOrders);
      } catch (error) {
        console.error("Error fetching orders:", error);
        toast.error("Failed to fetch orders. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, []);

  return (
    <PageLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-center">Your Past Orders</h1>

        {loading ? (
          <p className="text-center text-gray-500">Loading orders...</p>
        ) : orders.length > 0 ? (
          <div className="space-y-6">
            {orders.map((order) => (
              <Card key={order._id} className="shadow-md">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Order {order._id}</CardTitle>
                    <CardDescription>Placed on {new Date(order.createdAt).toLocaleDateString()}</CardDescription>
                  </div>
                  <Badge variant={
                    order.status === "Delivered" ? "default" : 
                    order.status === "Processing" ? "secondary" : 
                    "outline"
                  }>
                    {order.status}
                  </Badge>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Product</TableHead>
                        <TableHead className="text-right">Quantity</TableHead>
                        <TableHead className="text-right">Price</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {order.items.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell>{item.name}</TableCell>
                          <TableCell className="text-right">{item.quantity}</TableCell>
                          <TableCell className="text-right">Rs. {item.price}</TableCell>
                        </TableRow>
                      ))}
                      <TableRow>
                        <TableCell colSpan={2} className="text-right font-bold">Total</TableCell>
                        <TableCell className="text-right font-bold">Rs. {order.totalAmount}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-lg text-gray-500">You don't have any past orders yet.</p>
            <Button variant="default" className="mt-4 bg-black hover:bg-gray-800">
              Start Shopping
            </Button>
          </div>
        )}
      </div>
    </PageLayout>
  );
};

export default OrdersPage;