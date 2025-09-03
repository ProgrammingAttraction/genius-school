import {
  FaBirthdayCake,
  FaVenusMars,
  FaEnvelope,
  FaPhone,
  FaHome,
  FaSchool,
  FaChalkboardTeacher,
  FaMapMarkerAlt,
} from "react-icons/fa";
import { IoMdMale, IoMdFemale } from "react-icons/io";

const StudentProfile = ({ student }) => {
  const base_url = "https://api-genius-school.arbeittechnology.com";

  const formatDate = (dateStr) => {
    if (!dateStr) return "Not specified";
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="w-full mx-auto mb-[20px] bg-white rounded-lg overflow-hidden shadow border border-gray-200">
      {/* Banner */}
      <div
        className="w-full h-48 bg-cover bg-center relative"
        style={{
          backgroundImage:
            "url('https://images.pexels.com/photos/32566447/pexels-photo-32566447.png')",
        }}
      >
        {/* Profile Picture */}
        <div className="absolute left-6 bottom-[-40px] w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-lg">
          <img
            src={
              student.profilePic
                ? `${base_url}/images/${student.profilePic}`
                : `https://avatars.dicebear.com/api/initials/${student.name}.svg?background=random`
            }
            alt={student.name}
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Main Body */}
      <div className="flex flex-col md:flex-row px-6 pt-12 pb-6 gap-6">
        {/* Left Info Card */}
        <div className="md:w-1/3">
          <h2 className="text-2xl font-semibold text-gray-900">
            {student.name}
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Student ID : {student.id || "N/A"}
          </p>

          <div className="mt-4 space-y-3 text-sm">
            <div className="flex items-center gap-2 text-gray-700">
              <FaEnvelope className="text-gray-500" />
              <span>{student.email || "N/A"}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-700">
              <FaPhone className="text-gray-500" />
              <span>{student.mobile || "N/A"}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-700">
              <FaMapMarkerAlt className="text-gray-500" />
              <span>{student.address || "N/A"}</span>
            </div>
          </div>
        </div>

        {/* Right Info Box */}
        <div className="md:w-2/3 rounded-lg  p-5 grid grid-cols-2 sm:grid-cols-2 gap-4">
            <InfoRow label="Father's Name" icon={<FaChalkboardTeacher />} value={student.fatherName || "N/A"} />
          <InfoRow label="Class" icon={<FaSchool />} value={student.studentClass || "N/A"} />

        

           <InfoRow label="Mother's Name" icon={<FaChalkboardTeacher />} value={student.motherName || "N/A"} />
          <InfoRow label="Section" icon={<FaSchool />} value={student.section || "N/A"} />
          
      
          <InfoRow label="Religion" icon={<FaSchool />} value={student.religion || "N/A"} />
          <InfoRow label="Group" icon={<FaSchool />} value={student.group || "N/A"} />
              <InfoRow
            label="Gender"
            icon={<FaVenusMars />}
            value={
              student.gender === "male" ? (
                <span className="flex items-center text-blue-700">
                  <IoMdMale className="mr-1" /> Male
                </span>
              ) : student.gender === "female" ? (
                <span className="flex items-center text-pink-700">
                  <IoMdFemale className="mr-1" /> Female
                </span>
              ) : (
                "Not specified"
              )
            }
          />
          <InfoRow label="Date of Birth" icon={<FaBirthdayCake />} value={formatDate(student.birthdate)} />
         
        </div>
      </div>
    </div>
  );
};

const InfoRow = ({ label, icon, value }) => (
  <div className="flex items-start gap-2">
    <span className="text-gray-500 mt-1">{icon}</span>
    <div className="flex-1">
      <p className="text-xs text-gray-500">{label}</p>
      <p className="text-sm text-gray-800 font-medium">{value}</p>
    </div>
  </div>
);

export default StudentProfile;
