'use client';

import { useSession } from 'next-auth/react';
import { Button, Card, Col, Container, Form, Row } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import swal from 'sweetalert';
import { addNote } from '@/lib/dbActions';
import LoadingSpinner from '@/components/LoadingSpinner';
import { AddNoteSchema } from '@/lib/validationSchemas';

const onSubmit = async (data: { note: string; contactId: number; owner: string }) => {
  await addNote(data);
  swal('Success', 'Your note has been added', 'success', {
    timer: 2000,
  });
};

const AddNoteForm = ({ contactId }: { contactId: number }) => {
  const { data: session, status } = useSession();
  const currentUser = session?.user?.email || '';
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(AddNoteSchema),
  });

  if (status === 'loading') {
    return <LoadingSpinner />;
  }

  if (status === 'unauthenticated') {
    return <LoadingSpinner />; // Replace with appropriate handling for unauthenticated users
  }

  return (
    <Container className="py-3">
      <Row className="justify-content-center">
        <Col xs={12}>
          <Card>
            <Card.Header className="text-center">Add Timestamped Note</Card.Header>
            <Card.Body>
              <Form onSubmit={handleSubmit(onSubmit)}>
                <input type="hidden" {...register('contactId')} value={contactId} />
                <input type="hidden" {...register('owner')} value={currentUser} />
                <Form.Group>
                  <Form.Label>Note</Form.Label>
                  <textarea
                    {...register('note')}
                    className={`form-control ${errors.note ? 'is-invalid' : ''}`}
                    style={{ resize: 'none', minHeight: '30px', maxHeight: '90px', overflowY: 'auto' }}
                    rows={1} // Starts with one line
                  />
                  <div className="invalid-feedback">{errors.note?.message}</div>
                </Form.Group>
                <Form.Group className="form-group">
                  <Row className="pt-3">
                    <Col className="d-grid gap-2">
                      <Button type="submit" variant="primary">Submit</Button>
                    </Col>
                    <Col className="d-grid gap-2">
                      <Button type="button" onClick={() => reset()} variant="warning">Reset</Button>
                    </Col>
                  </Row>
                </Form.Group>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default AddNoteForm;
