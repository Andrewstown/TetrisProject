"""empty message

Revision ID: 6600c0a7d49d
Revises: 575a99a316c0
Create Date: 2023-04-19 14:08:51.853460

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '6600c0a7d49d'
down_revision = '575a99a316c0'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('avatars', schema=None) as batch_op:
        batch_op.alter_column('price',
               existing_type=sa.FLOAT(),
               type_=sa.Integer(),
               existing_nullable=True)

    with op.batch_alter_table('sprites', schema=None) as batch_op:
        batch_op.alter_column('price',
               existing_type=sa.FLOAT(),
               type_=sa.Integer(),
               existing_nullable=True)

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('sprites', schema=None) as batch_op:
        batch_op.alter_column('price',
               existing_type=sa.Integer(),
               type_=sa.FLOAT(),
               existing_nullable=True)

    with op.batch_alter_table('avatars', schema=None) as batch_op:
        batch_op.alter_column('price',
               existing_type=sa.Integer(),
               type_=sa.FLOAT(),
               existing_nullable=True)

    # ### end Alembic commands ###