import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect } from "react";
import { serviceSchema, type ServiceFormValues } from "../../schemas/serviceSchema";
import type { Service } from "../../types";

interface ServiceFormProps {
  initialValues?: Service;
  onSubmit: (data: ServiceFormValues) => void;
  onCancel: () => void;
  isSubmitting: boolean;
  submitError?: string;
}

const inputClass =
  "w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500";

const ServiceForm = ({
  initialValues,
  onSubmit,
  onCancel,
  isSubmitting,
  submitError,
}: ServiceFormProps) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ServiceFormValues>({
    resolver: yupResolver(serviceSchema),
    defaultValues: {
      name: initialValues?.name ?? "",
      price: initialValues?.price ?? undefined,
      duration: initialValues?.duration ?? undefined,
    },
  });

  useEffect(() => {
    if (initialValues) {
      reset({
        name: initialValues.name,
        price: initialValues.price,
        duration: initialValues.duration,
      });
    }
  }, [initialValues, reset]);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="mb-6 space-y-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm"
    >
      <div>
        <label htmlFor="name" className="mb-1 block text-sm font-medium text-gray-700">
          Service name
        </label>
        <input id="name" type="text" className={inputClass} {...register("name")} />
        {errors.name && (
          <p role="alert" className="mt-1 text-sm text-red-600">
            {errors.name.message}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="price" className="mb-1 block text-sm font-medium text-gray-700">
          Price (NPR)
        </label>
        <input
          id="price"
          type="number"
          step="0.01"
          className={inputClass}
          {...register("price")}
        />
        {errors.price && (
          <p role="alert" className="mt-1 text-sm text-red-600">
            {errors.price.message}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="duration" className="mb-1 block text-sm font-medium text-gray-700">
          Duration (minutes)
        </label>
        <input id="duration" type="number" className={inputClass} {...register("duration")} />
        {errors.duration && (
          <p role="alert" className="mt-1 text-sm text-red-600">
            {errors.duration.message}
          </p>
        )}
      </div>

      {submitError && (
        <p role="alert" className="text-sm text-red-600">
          {submitError}
        </p>
      )}

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
        >
          {isSubmitting ? "Saving..." : initialValues ? "Update" : "Add Service"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default ServiceForm;