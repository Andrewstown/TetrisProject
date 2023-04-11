"""empty message

Revision ID: f97e87669799
Revises: f8f855313f97
Create Date: 2023-04-11 14:10:17.895366

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'f97e87669799'
down_revision = 'f8f855313f97'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('users', schema=None) as batch_op:
        batch_op.add_column(sa.Column('ghost', sa.Boolean(), nullable=True))
        batch_op.add_column(sa.Column('sound', sa.Boolean(), nullable=True))

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('users', schema=None) as batch_op:
        batch_op.drop_column('sound')
        batch_op.drop_column('ghost')

    # ### end Alembic commands ###