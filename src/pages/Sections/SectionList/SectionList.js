import React, { useEffect, useState } from "react";
import { useHistory } from "react-router";
import { HandleUnauthorizedOrForbiddenError } from "../../../components/Errors/ErrorHandlers";
import { JsonFetch } from "../../../components/fetches/Fetches";
import Loader from "../../../components/loader/Loader";
import { Modal } from "../../../components/Messages/Modal";
import { settings } from "../../../settings";
import SaveSection from "../SaveSection/SaveSection";

const getSections = async (setSections, setIsLoading, history) => {
  try {
    setIsLoading(true);
    const response = await JsonFetch(
      `${settings.baseURL}/api/Section/names`,
      "GET",
      false,
      null
    );

    switch (response.status) {
      case 200:
        const sections = await response.json();
        setSections(sections);
        setIsLoading(false);
        break;
      case 500:
        history.push("/500");
        break;
      default:
        console.log(response);
        break;
    }
  } catch (err) {
    console.error(err);
  }
};

const deleteSection = async (id, setIsDeleted, setIsLoading, history) => {
  try {
    setIsLoading(true);
    const response = await JsonFetch(
      `${settings.baseURL}/api/Section/${id}`,
      "DELETE",
      true,
      null
    );

    switch (response.status) {
      case 204:
        setIsDeleted(true);
        setIsLoading(false);
        break;
      case 401:
      case 403:
        HandleUnauthorizedOrForbiddenError(history);
        break;
      case 500:
        history.push("/500");
        break;
      default:
        console.log(response);
        break;
    }
  } catch (err) {
    console.error(err);
  }
};

export const DisplaySections = ({
  sections,
  setSelectedSectionId,
  deleteSection,
  setIsDeleted,
  setIsLoading,
  history,
}) => {
  if (sections.length < 1) return <div>There are no sections yet.</div>;

  return (
    <ul>
      {sections.map(({ id, title }) => {
        return (
          <li key={id}>
            <span> {title}</span>
            <button onClick={() => setSelectedSectionId(id)}>Edit</button>
            <button
              onClick={() =>
                deleteSection(id, setIsDeleted, setIsLoading, history)
              }
            >
              Delete
            </button>
          </li>
        );
      })}
    </ul>
  );
};

const DeletedModal = ({ children, setIsDeleted }) => {
  return (
    <Modal>
      {children}
      <button onClick={() => setIsDeleted(null)}>OK</button>
    </Modal>
  );
};

export default function SectionList() {
  const [selectedSectionId, setSelectedSectionId] = useState(null);
  const [sections, setSections] = useState([]);
  const [isDeleted, setIsDeleted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const history = useHistory();

  useEffect(() => {
    if (isDeleted) return;
    getSections(setSections, setIsLoading, history);
  }, [isDeleted]);

  if (isDeleted)
    return (
      <DeletedModal setIsDeleted={setIsDeleted}>
        <p>Successfully deleted the section.</p>
      </DeletedModal>
    );

  if (isLoading) return <Loader />;

  if (selectedSectionId)
    return (
      <>
        <button onClick={() => setSelectedSectionId(null)}>Back to list</button>
        <SaveSection
          sectionId={selectedSectionId}
          setSelectedSectionId={setSelectedSectionId}
        />
      </>
    );

  return (
    <DisplaySections
      sections={sections}
      setSelectedSectionId={setSelectedSectionId}
      deleteSection={deleteSection}
      setIsDeleted={setIsDeleted}
      setIsLoading={setIsLoading}
      history={history}
    />
  );
}
