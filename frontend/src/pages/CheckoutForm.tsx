import type React from "react"
import { useState } from "react"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { useCart } from "@/contexts/CartContext"
import emailjs from "@emailjs/browser"
import { CheckCircle, Truck, CreditCard, Package } from "lucide-react"

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  phone: z.string().min(10, { message: "Please enter a valid phone number" }),
  address: z.string().min(5, { message: "Address must be at least 5 characters" }),
  city: z.string().min(2, { message: "City must be at least 2 characters" }),
  apartment: z.string().optional(),
})

type CheckoutFormValues = z.infer<typeof formSchema>

interface CheckoutFormProps {
  onSuccess: () => void
}

const CheckoutForm: React.FC<CheckoutFormProps> = ({ onSuccess }) => {
  const { cartItems, subtotal, clearCart } = useCart()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      apartment: "",
    },
  })

  const onSubmit = async (data: CheckoutFormValues) => {
    setIsSubmitting(true)
    try {
      // Prepare order details for the email
      const orderDetails = cartItems
        .map(
          (item) =>
            `${item.name} - Quantity: ${item.quantity} - Price: Rs. ${Number(item.price)} - Total: Rs. ${
              Number(item.price) * Number(item.quantity)
            }`,
        )
        .join("\n")

     const templateParams = {
  from_name: data.name,
  from_email: data.email,
  phone: data.phone,
  address: `${data.address}, ${data.city}${data.apartment ? ", " + data.apartment : ""}`,
  order_details: orderDetails,
  total_amount: `Rs. ${subtotal.toFixed(2)}`,
  to_email: "l227906@lhr.nu.edu.pk",
};
      console.log("Template Params:", templateParams)
      // Send email using EmailJS
      await emailjs.send(
         "service_uzqy9ri",
         "template_vyecb2o",
        templateParams,
         "jzNLC7YoCPX13aoOY",
      )

      toast.success("Order placed successfully! You will receive a confirmation shortly.")
      clearCart()
      onSuccess()

      // Here API will be integrated of place order
    } catch (error) {
      console.error("Error sending email:", error)
      toast.error("Failed to place order. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="bg-gradient-to-b from-white to-gray-50 rounded-xl shadow-md p-8 mt-6">
      <div className="max-w-4xl mx-auto">
        {/* Checkout Steps */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white mb-2">
                <Package size={20} />
              </div>
              <span className="text-xs font-medium">Cart</span>
            </div>
            <div className="flex-1 h-1 bg-primary mx-2"></div>
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white mb-2">
                <Truck size={20} />
              </div>
              <span className="text-xs font-medium">Shipping</span>
            </div>
            <div className="flex-1 h-1 bg-gray-200 mx-2"></div>
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 mb-2">
                <CreditCard size={20} />
              </div>
              <span className="text-xs text-gray-500">Payment</span>
            </div>
            <div className="flex-1 h-1 bg-gray-200 mx-2"></div>
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 mb-2">
                <CheckCircle size={20} />
              </div>
              <span className="text-xs text-gray-500">Confirmation</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-xl font-semibold mb-6 pb-2 border-b">Shipping Information</h2>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium text-gray-700">Full Name</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="John Doe"
                              className="rounded-md border-gray-300 focus:ring-primary focus:border-primary"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage className="text-xs" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium text-gray-700">Email</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="john@example.com"
                              type="email"
                              className="rounded-md border-gray-300 focus:ring-primary focus:border-primary"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage className="text-xs" />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-gray-700">Phone Number</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="+92 300 1234567"
                            className="rounded-md border-gray-300 focus:ring-primary focus:border-primary"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-gray-700">Address</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="123 Main Street"
                            className="rounded-md border-gray-300 focus:ring-primary focus:border-primary"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="city"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium text-gray-700">City</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Lahore"
                              className="rounded-md border-gray-300 focus:ring-primary focus:border-primary"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage className="text-xs" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="apartment"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium text-gray-700">
                            Apartment/Street (Optional)
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Apartment 4B"
                              className="rounded-md border-gray-300 focus:ring-primary focus:border-primary"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage className="text-xs" />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="mt-6 lg:hidden">
                    <Button
                      type="submit"
                      className="w-full py-2.5 rounded-md transition-all duration-200 flex items-center justify-center"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Processing..." : "Place Order"}
                    </Button>
                  </div>
                </form>
              </Form>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-lg shadow-sm sticky top-4">
              <h3 className="font-semibold text-lg mb-4 pb-2 border-b">Order Summary</h3>

              <div className="space-y-3 mb-4 max-h-60 overflow-y-auto pr-2">
                {cartItems.map((item) => (
                  <div key={item.productId} className="flex items-center gap-3 py-2 border-b border-gray-100">
                    <div className="w-12 h-12 rounded bg-gray-100 flex-shrink-0 overflow-hidden">
                      {item.image && (
                        <img
                          src={item.image || "/placeholder.svg"}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{item.name}</p>
                      <div className="flex justify-between text-sm text-gray-500">
                        <span>
                          {item.quantity} × Rs. {Number(item.price).toFixed(2)}
                        </span>
                        <span className="font-medium text-gray-900">
                          Rs. {(Number(item.price) * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-2 pt-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span>Rs. {subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Shipping</span>
                  <span className="text-green-600">Free</span>
                </div>
                <div className="flex justify-between font-semibold text-base pt-3 border-t mt-2">
                  <span>Total</span>
                  <span className="text-primary">Rs. {subtotal.toFixed(2)}</span>
                </div>
              </div>

              <div className="mt-6 hidden lg:block">
                <Button
                  type="submit"
                  onClick={form.handleSubmit(onSubmit)}
                  className="w-full py-2.5 rounded-md transition-all duration-200 flex items-center justify-center"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Processing..." : "Place Order"}
                </Button>
              </div>

              <div className="mt-4 text-xs text-gray-500 text-center">
                <p>By placing your order, you agree to our Terms of Service and Privacy Policy</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CheckoutForm
