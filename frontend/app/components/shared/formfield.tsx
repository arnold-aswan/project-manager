import { useFormContext } from "react-hook-form";
import {
	FormControl,
	FormItem,
	FormLabel,
	FormMessage,
	FormField as ShadFormField,
} from "../ui/form";
import { Input } from "../ui/input";

type FormFieldProps = {
	label: string;
	name: string;
	type: string;
	placeholder?: string;
};

export const FormField = ({
	label,
	name,
	type,
	placeholder,
}: FormFieldProps) => {
	const form = useFormContext();

	return (
		<ShadFormField
			control={form.control}
			name={name}
			render={({ field }) => (
				<FormItem>
					<FormLabel>{label}</FormLabel>
					<FormControl>
						<Input
							{...field}
							id={name}
							type={type}
							placeholder={placeholder}
						/>
					</FormControl>
					<FormMessage />
				</FormItem>
			)}
		/>
	);
};
