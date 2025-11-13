import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { FloatingInput } from "@/components/ui/FloatingInput";
import { DividerHeading } from "@/components/ui/DividerHeading";
import { User } from "lucide-react";

const PersonalInformation = () => {
    const {
        register,
        setValue,
        watch,
        handleSubmit,
        formState: { errors },
    } = useForm({
        mode: 'onChange',
        defaultValues: {
            title: "Mr",
            firstName: "",
            middleName: "",
            lastName: "",
            preferred: "",
            dob: "",
            maritalStatus: "Married",
            mothersName: "",
            gender: 'Male',
            relationshipMngr: 'Relationship Manager 1',
            owner: '',
            cont1: 'Home',
            cont1Val: '',
            cont2: 'Mobile',
            cont2Val: '',
            cont3: 'Business',
            cont3Val: '',
            cont4: 'Business Fax',
            cont4Val: '',
            cont5: 'Email 1',
            cont5Val: '',
            method: 'No Preference',
            addToDMH: false,
            isEmailMarketing: false,
            categories: '',
            isPermantAusResident: false,
            residency: '',
            residencyStatus: '',
            citizenship: ''
        },
    });

    const onSubmit = (data: any) => {
        console.log("Submit Personal Info:", data);
        // Make API call here
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Card className="shadow-card">
                <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                        <User className="w-5 h-5" />
                        <span>Personal Information</span>
                    </CardTitle>
                    <CardDescription>Basic personal and contact details</CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* ==================   GENERAL   ================== */}
                    <div className="space-y-3">
                        <DividerHeading text="general" />
                        <FloatingInput
                            label="Title"
                            id="title"
                            name="title"
                            type="select"
                            register={register}
                            rules={{ required: "Title is required" }}
                            options={["Mr", "Ms", "Mrs"]}
                            error={errors.title}
                        />
                        <FloatingInput
                            label="First Name"
                            id="firstName"
                            name="firstName"
                            register={register}
                            rules={{ required: "First Name is required", minLength: { value: 3, message: "Minimum 3 characters" } }}
                            error={errors.firstName}
                        />
                        <FloatingInput
                            label="Middle Name"
                            id="middleName"
                            name="middleName"
                            register={register}
                            rules={{}}
                            error={errors.middleName}
                        />
                        <FloatingInput
                            label="Last Name"
                            id="lastName"
                            name="lastName"
                            register={register}
                            rules={{ required: "Last Name is required", minLength: { value: 3, message: "Minimum 3 characters" } }}
                            error={errors.lastName}
                        />
                        <FloatingInput
                            label="Preferred"
                            id="preferred"
                            name="preferred"
                            register={register}
                            rules={{}}
                            error={errors.lastName}
                        />
                        <FloatingInput
                            label="Date of Birth"
                            id="dob"
                            name="dob"
                            type="date"
                            register={register}
                            rules={{ required: "Date of birth is required" }}
                            error={errors.dob}
                            setValue={setValue}
                            watch={watch}
                            cursor="pointer"
                            dateMode="dob"
                        />
                        <FloatingInput
                            label="Marital Status"
                            selectTxt="Select marital status"
                            id="maritalStatus"
                            name="maritalStatus"
                            type="select"
                            register={register}
                            rules={{ required: "Marital Status is required" }}
                            options={["Married", "Unmarried"]}
                            error={errors.maritalStatus}
                        />
                        <FloatingInput
                            label="Mother's Mdn Name"
                            id="mothersName"
                            name="mothersName"
                            register={register}
                            rules={{}}
                            error={errors.mothersName}
                        />
                        <FloatingInput
                            label="Gender"
                            selectTxt="Select gender"
                            id="gender"
                            name="gender"
                            type="select"
                            register={register}
                            rules={{ required: "Gender is required" }}
                            options={["Male", "Female", "Others"]}
                            error={errors.gender}
                        />
                        <FloatingInput
                            label="Relationship Manager"
                            selectTxt="Select relationship manager"
                            id="relationshipMngr"
                            name="relationshipMngr"
                            type="select"
                            register={register}
                            rules={{}}
                            options={["Relationship Manager 1", "Relationship Manager 2", "Relationship Manager 3"]}
                            error={errors.relationshipMngr}
                        />
                        <FloatingInput
                            label="Owner"
                            id="owner"
                            name="owner"
                            register={register}
                            rules={{}}
                            error={errors.owner}
                        />
                    </div>
                    {/* ===================   CONTACT DETAILS    =============== */}
                    <div className="space-y-3">
                        <DividerHeading text="Contact Details" />
                        <div className="grid grid-cols-2 gap-1">
                            <FloatingInput
                                label=""
                                id="cont1"
                                name="cont1"
                                type="select"
                                register={register}
                                rules={{}}
                                options={["Home", "Mobile", "Business", "Business Fax", "Email 1"]}
                                error={errors.cont1}
                            />
                            <FloatingInput
                                label=""
                                id="cont1Val"
                                name="cont1Val"
                                register={register}
                                rules={{}}
                                error={errors.cont1Val}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-1">
                            <FloatingInput
                                label=""
                                id="cont2"
                                name="cont2"
                                type="select"
                                register={register}
                                rules={{}}
                                options={["Home", "Mobile", "Business", "Business Fax", "Email 1"]}
                                error={errors.cont2}
                            />
                            <FloatingInput
                                label=""
                                id="cont2Val"
                                name="cont2Val"
                                register={register}
                                rules={{}}
                                error={errors.cont2Val}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-1">
                            <FloatingInput
                                label=""
                                id="cont3"
                                name="cont3"
                                type="select"
                                register={register}
                                rules={{}}
                                options={["Home", "Mobile", "Business", "Business Fax", "Email 1"]}
                                selected="Business Fax"
                                error={errors.cont3}
                            />
                            <FloatingInput
                                label=""
                                id="cont3Val"
                                name="cont3Val"
                                register={register}
                                rules={{}}
                                error={errors.cont3Val}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-1">
                            <FloatingInput
                                label=""
                                id="cont4"
                                name="cont4"
                                type="select"
                                register={register}
                                rules={{}}
                                options={["Home", "Mobile", "Business", "Business Fax", "Email 1"]}
                                selected="Business"
                                error={errors.cont4}
                            />
                            <FloatingInput
                                label=""
                                id="cont4Val"
                                name="cont4Val"
                                register={register}
                                rules={{}}
                                error={errors.cont4Val}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-1">
                            <FloatingInput
                                label=""
                                id="cont5"
                                name="cont5"
                                type="select"
                                register={register}
                                rules={{}}
                                options={["Home", "Mobile", "Business", "Business Fax", "Email 1"]}
                                selected="Business"
                                error={errors.cont5}
                            />
                            <FloatingInput
                                label=""
                                id="cont5Val"
                                name="cont5Val"
                                register={register}
                                rules={{}}
                                error={errors.cont5Val}
                            />
                        </div>
                        <FloatingInput
                            label="Preferred Contact Method"
                            selectTxt=""
                            id="method"
                            name="method"
                            type="select"
                            register={register}
                            rules={{}}
                            options={["No Preference", "Home", "Mobile", "Business", "Business Fax", "Email 1"]}
                            selected="No Preference"
                            error={errors.method}
                        />

                        <FloatingInput
                            label="Categories"
                            selectTxt="Select category"
                            id="categories"
                            name="categories"
                            type="select"
                            register={register}
                            rules={{}}
                            options={["Category 1", "Category 2", "Category 3", "Category 4"]}
                            selected="Category 1"
                            error={errors.categories}
                        />
                    </div>

                    {/* ==========  RESIDENCY    =========== */}
                    <div className="space-y-3">
                        <DividerHeading text="Residency" />
                        <FloatingInput
                            label="Residency"
                            selectTxt="Select Country"
                            id="residency"
                            name="residency"
                            type="select"
                            register={register}
                            rules={{}}
                            options={["Country 1", "Country 2", "Country 3", "Country 4"]}
                            selected="Country 1"
                            error={errors.residency}
                        />
                        <FloatingInput
                            label="Status"
                            selectTxt="Residency Status"
                            id="residencyStatus"
                            name="residencyStatus"
                            type="select"
                            register={register}
                            rules={{}}
                            options={["Option 1", "Option 2", "Option 3", "Option 4"]}
                            selected="Option 1"
                            error={errors.residencyStatus}
                        />
                        <FloatingInput
                            label="Citizenship"
                            selectTxt="Country of Citizenship"
                            id="citizenship"
                            name="citizenship"
                            type="select"
                            register={register}
                            rules={{}}
                            options={["Country 1", "Country 2", "Country 3", "Country 4"]}
                            selected="Country 1"
                            error={errors.citizenship}
                        />

                        <FloatingInput
                            label="Permanent Aust. Resident"
                            id="isPermantAusResident"
                            name="isPermantAusResident"
                            type="checkbox"
                            register={register}
                            rules={{}}
                            error={errors.isPermantAusResident}
                        />
                    </div>
                </CardContent>
            </Card>
        </form>
    );
};

export default PersonalInformation;
