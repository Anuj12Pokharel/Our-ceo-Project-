import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { useForm, Controller } from "react-hook-form";
import RecipientsInput from "@/components/email/RecipientsInput";
import AttachmentsInput from "@/components/email/AttachmentsInput";
import { FloatingInput } from "@/components/ui/FloatingInput";
import { v4 as uuid } from "uuid";
import { addMessage, updateMessage } from "@/utils/messages";

const ComposeTab = () => {
    const { control, handleSubmit, reset } = useForm({
        defaultValues: { recipients: [], subject: "", body: "", attachments: [] as File[] },
    });

    const sendMessage = (status: "sent" | "draft") => (data: any) => {
        // Convert attachments to safe objects
        const convertFiles = (files: File[]) =>
            files.map(file => ({
                name: file.name,
                type: file.type,
                size: file.size,
                url: URL.createObjectURL(file) // for preview/download
            }));

        const msg = {
            id: uuid(),
            ...data,
            attachments: convertFiles(data.attachments), // convert here
            status,
            date: new Date().toISOString(),
        };

        addMessage(msg); // store the message
        reset(); // reset the form
        alert(status === "sent" ? "Message sent!" : "Draft saved!");
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Compose Message</CardTitle>
                <CardDescription>Send internal messages</CardDescription>
            </CardHeader>
            <CardContent>
                <form className="space-y-4" onSubmit={handleSubmit(sendMessage("sent"))}>
                    <Controller
                        control={control}
                        name="recipients"
                        defaultValue={[]} // important!
                        rules={{ validate: (val) => val?.length > 0 || "Add at least one recipient" }}
                        render={({ field, fieldState }) => (
                            <div>
                                <label className="text-sm font-semibold">Recipients</label>
                                <RecipientsInput
                                    value={Array.isArray(field.value) ? field.value : []} // safeguard
                                    onChange={field.onChange}
                                    placeholder="Type recipient..."
                                />
                                {fieldState.error && (
                                    <p className="text-xs text-red-500">{fieldState.error.message}</p>
                                )}
                            </div>
                        )}
                    />
                    <Controller control={control} name="subject" rules={{ required: "Subject required" }} render={({ field, fieldState }) => <FloatingInput label="Subject" id="subject" type="text" {...field} error={fieldState.error} />} />
                    <Controller control={control} name="body" rules={{ required: "Body required" }} render={({ field, fieldState }) => <FloatingInput label="Message" id="body" type="textarea" rows={8} {...field} error={fieldState.error} />} />
                    <Controller control={control} name="attachments" render={({ field }) => <AttachmentsInput value={field.value || []} onChange={field.onChange} />} />
                    <div className="flex space-x-2">
                        <button type="submit" className="px-4 py-2 bg-primary text-white rounded hover:bg-primary-hover">Send</button>
                        <button type="button" onClick={handleSubmit(sendMessage("draft"))} className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600">Save Draft</button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
};

export default ComposeTab;
