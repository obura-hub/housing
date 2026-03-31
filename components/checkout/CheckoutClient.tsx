"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  CreditCard,
  Smartphone,
  Landmark,
  Home,
  Building,
  MapPin,
  BedDouble,
  Bath,
  Ruler,
} from "lucide-react";
import { UnitDetails } from "@/app/lib/actions/unitActions";
import { createBooking } from "@/app/lib/actions/bookingActions";

const checkoutSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number is required"),
  idNumber: z.string().optional(),
  paymentMethod: z.enum(["mpesa", "card", "bank"], {
    required_error: "Select a payment method",
  }),
  depositAmount: z.number().positive("Deposit amount must be positive"),
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

interface CheckoutClientProps {
  unit: UnitDetails;
}

const depositOptions = [
  { value: 5000, label: "Ksh 5,000 (Booking Fee)" },
  { value: 10000, label: "Ksh 10,000" },
  { value: 25000, label: "Ksh 25,000" },
  { value: 50000, label: "Ksh 50,000" },
];

export default function CheckoutClient({ unit }: CheckoutClientProps) {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [bookingSuccess, setBookingSuccess] = useState<{
    bookingId: number;
  } | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      paymentMethod: "mpesa",
      depositAmount: 5000,
    },
  });

  const selectedDeposit = watch("depositAmount");

  const onSubmit = async (data: CheckoutFormData) => {
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      const result = await createBooking({
        unitId: unit.unitId,
        ...data,
      });
      if (result.success) {
        setBookingSuccess({ bookingId: result.bookingId });
        setStep(3); // success step
      } else {
        setSubmitError(
          result.message || "Failed to create booking. Please try again.",
        );
      }
    } catch (err) {
      setSubmitError("An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatPrice = (price: number) => `Ksh ${price.toLocaleString()}`;

  // Step 1: Summary and user details form
  if (step === 1) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Order Summary */}
          <div className="lg:col-span-1 order-2 lg:order-1">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 sticky top-24">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Your Selection
              </h2>
              <div className="space-y-4">
                {unit.images[0] && (
                  <div className="relative h-40 rounded-lg overflow-hidden bg-gray-100">
                    <Image
                      src={unit.images[0]}
                      alt={unit.projectName}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {unit.projectName}
                  </h3>
                  <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
                    <MapPin className="w-3 h-3" /> {unit.projectLocation}
                  </div>
                </div>
                <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">
                      Unit Type:
                    </span>
                    <span className="font-medium">{unit.unitType}</span>
                  </div>
                  <div className="flex justify-between text-sm mt-2">
                    <span className="text-gray-600 dark:text-gray-400">
                      Unit Number:
                    </span>
                    <span className="font-medium">{unit.unitNumber}</span>
                  </div>
                  <div className="flex justify-between text-sm mt-2">
                    <span className="text-gray-600 dark:text-gray-400">
                      Floor:
                    </span>
                    <span className="font-medium">{unit.floorNumber}</span>
                  </div>
                  <div className="flex justify-between text-sm mt-2">
                    <span className="text-gray-600 dark:text-gray-400">
                      Bedrooms:
                    </span>
                    <span className="font-medium">{unit.bedrooms}</span>
                  </div>
                  <div className="flex justify-between text-sm mt-2">
                    <span className="text-gray-600 dark:text-gray-400">
                      Bathrooms:
                    </span>
                    <span className="font-medium">{unit.bathrooms}</span>
                  </div>
                  <div className="flex justify-between text-sm mt-2">
                    <span className="text-gray-600 dark:text-gray-400">
                      Size:
                    </span>
                    <span className="font-medium">{unit.size}</span>
                  </div>
                </div>
                <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                  <div className="flex justify-between font-bold text-gray-900 dark:text-white">
                    <span>Total Price:</span>
                    <span className="text-green-600">
                      {formatPrice(unit.totalPrice)}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Price includes adjustments
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Checkout Form */}
          <div className="lg:col-span-2 order-1 lg:order-2">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 md:p-8">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center">
                  1
                </div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Complete Your Booking
                </h1>
              </div>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Personal Details */}
                <div className="space-y-4">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Personal Information
                  </h2>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        {...register("fullName")}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-green-500"
                      />
                      {errors.fullName && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.fullName.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Email *
                      </label>
                      <input
                        type="email"
                        {...register("email")}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-green-500"
                      />
                      {errors.email && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.email.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        {...register("phone")}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-green-500"
                      />
                      {errors.phone && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.phone.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        ID Number (Optional)
                      </label>
                      <input
                        type="text"
                        {...register("idNumber")}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-green-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Payment Method */}
                <div className="space-y-4">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Payment Method
                  </h2>
                  <div className="grid sm:grid-cols-3 gap-3">
                    <label
                      className={`flex items-center gap-2 p-3 border rounded-lg cursor-pointer transition ${watch("paymentMethod") === "mpesa" ? "border-green-500 bg-green-50 dark:bg-green-900/20" : "border-gray-200 dark:border-gray-700"}`}
                    >
                      <input
                        type="radio"
                        value="mpesa"
                        {...register("paymentMethod")}
                        className="hidden"
                      />
                      <Smartphone className="w-5 h-5 text-green-600" />
                      <span>M-Pesa</span>
                    </label>
                    <label
                      className={`flex items-center gap-2 p-3 border rounded-lg cursor-pointer transition ${watch("paymentMethod") === "card" ? "border-green-500 bg-green-50 dark:bg-green-900/20" : "border-gray-200 dark:border-gray-700"}`}
                    >
                      <input
                        type="radio"
                        value="card"
                        {...register("paymentMethod")}
                        className="hidden"
                      />
                      <CreditCard className="w-5 h-5 text-green-600" />
                      <span>Card</span>
                    </label>
                    <label
                      className={`flex items-center gap-2 p-3 border rounded-lg cursor-pointer transition ${watch("paymentMethod") === "bank" ? "border-green-500 bg-green-50 dark:bg-green-900/20" : "border-gray-200 dark:border-gray-700"}`}
                    >
                      <input
                        type="radio"
                        value="bank"
                        {...register("paymentMethod")}
                        className="hidden"
                      />
                      <Landmark className="w-5 h-5 text-green-600" />
                      <span>Bank Transfer</span>
                    </label>
                  </div>
                  {errors.paymentMethod && (
                    <p className="text-red-500 text-xs">
                      {errors.paymentMethod.message}
                    </p>
                  )}
                </div>

                {/* Deposit Amount */}
                <div className="space-y-4">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Deposit Amount (Booking Fee)
                  </h2>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {depositOptions.map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => setValue("depositAmount", opt.value)}
                        className={`p-2 text-center rounded-lg border transition ${
                          selectedDeposit === opt.value
                            ? "border-green-500 bg-green-50 dark:bg-green-900/20 text-green-700"
                            : "border-gray-200 dark:border-gray-700 hover:border-green-300"
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Custom Amount
                    </label>
                    <input
                      type="number"
                      {...register("depositAmount", { valueAsNumber: true })}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-green-500"
                      placeholder="Enter amount"
                    />
                  </div>
                  {errors.depositAmount && (
                    <p className="text-red-500 text-xs">
                      {errors.depositAmount.message}
                    </p>
                  )}
                </div>

                {submitError && (
                  <div className="p-3 bg-red-50 text-red-600 rounded-lg">
                    {submitError}
                  </div>
                )}

                <div className="flex justify-between items-center pt-4">
                  <Link
                    href={`/project/${unit.projectId}/unit-types/${unit.unitTypeId}`}
                    className="flex items-center gap-1 text-gray-600 hover:text-gray-900"
                  >
                    <ArrowLeft className="w-4 h-4" /> Back
                  </Link>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center gap-2 disabled:opacity-50"
                  >
                    {isSubmitting ? "Processing..." : "Proceed to Payment"}
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Success step (step 3)
  if (step === 3 && bookingSuccess) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Booking Confirmed!
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Thank you for choosing {unit.projectName}. Your booking reference is{" "}
            <strong>#{bookingSuccess.bookingId}</strong>.
          </p>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            We have sent a confirmation email to your address with payment
            instructions. You will be contacted by our team within 24 hours.
          </p>
          <Link
            href={`/project/${unit.projectId}`}
            className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
          >
            Return to Project
          </Link>
        </div>
      </div>
    );
  }

  // Fallback (should not reach)
  return null;
}
