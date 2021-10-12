import clsx from 'clsx'
import { useForm } from 'react-hook-form'
import { api } from '~/config'
import { store } from '~/store'
import { User } from '~/types'

type Data = {
  name: string
}
export function ProfileForm({ user }: { user: User }): React.ReactElement {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<Data>({
    defaultValues: { name: user.name }
  })
  const onSubmit = async ({ name }: Data) => {
    await api.updateMe({ name })
    store.dispatch('me/login')
  }
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="form-group">
        <label>Name (5-20 chars)</label>
        <input
          className={clsx(errors.name && 'is-invalid', 'form-control')}
          required
          {...register('name', { required: true, minLength: 5, maxLength: 20 })}
        />
      </div>
      <button type="submit" className="btn btn-primary">
        Submit
      </button>
    </form>
  )
}
