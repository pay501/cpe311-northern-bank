import React from "react";

interface Props{
    formData:{
        id_number: string;
        first_name: string;
        last_name: string;
    };
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

const CreateUserForm: React.FC<Props> = ({ formData, handleChange }:Props) => {
  return (
    <div>
      <input
        type="text"
        name="id_number"
        placeholder="หมายเลขประจำตัว"
        value={formData.id_number}
        onChange={handleChange}
        className="w-full p-2 border border-gray-300 rounded mb-2"
        required
      />
      <input
        type="text"
        name="first_name"
        placeholder="ชื่อจริง"
        value={formData.first_name}
        onChange={handleChange}
        className="w-full p-2 border border-gray-300 rounded mb-2"
        required
      />
      <input
        type="text"
        name="last_name"
        placeholder="นามสกุล"
        value={formData.last_name}
        onChange={handleChange}
        className="w-full p-2 border border-gray-300 rounded mb-2"
        required
      />
    </div>
  );
};

export default CreateUserForm;
