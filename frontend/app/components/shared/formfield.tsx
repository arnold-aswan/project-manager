import { useFormContext } from "react-hook-form";
import {
	FormControl,
	FormItem,
	FormLabel,
	FormMessage,
	FormField as ShadFormField,
} from "../ui/form";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "../ui/select";

type FormFieldProps = {
	label: string;
	name: string;
	type: string;
	placeholder?: string;
	options?: any;
};

export const FormField = ({
	label,
	name,
	type,
	placeholder,
	options,
}: FormFieldProps) => {
	const form = useFormContext();

	return (
		<ShadFormField
			control={form.control}
			name={name}
			render={({ field }: { field: any }) => (
				<FormItem>
					<FormLabel>{label}</FormLabel>
					<FormControl>
						{type === "textarea" ? (
							<Textarea
								{...field}
								id={name}
								placeholder={placeholder}
								rows={5}
							/>
						) : type === "select" ? (
							<Select
								onValueChange={field.onChange}
								value={field.value}
								defaultValue={field.value}
							>
								<SelectTrigger className="w-[180px]">
									<SelectValue placeholder={placeholder} />
								</SelectTrigger>
								<SelectContent>
									{options?.map((option: string) => (
										<SelectItem
											key={option}
											value={option}
										>
											{option}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						) : (
							<Input
								{...field}
								id={name}
								type={type}
								placeholder={placeholder}
							/>
						)}
					</FormControl>
					<FormMessage />
				</FormItem>
			)}
		/>
	);
};
